"""Minimal Chromium DevTools transport and lifecycle support."""

from __future__ import annotations

import base64
import functools
import hashlib
import http.server
import json
import os
import secrets
import shutil
import signal
import socket
import struct
import subprocess
import tempfile
import threading
import time
import urllib.parse
import urllib.request
from pathlib import Path


class BrowserError(RuntimeError):
    pass


class QuietFileServer(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_: object) -> None:
        pass


class DevToolsSocket:
    def __init__(self, websocket_url: str) -> None:
        parsed = urllib.parse.urlsplit(websocket_url)
        self.socket = socket.create_connection((parsed.hostname, parsed.port), timeout=10)
        self.socket.settimeout(15)
        key = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
        path = parsed.path + (f"?{parsed.query}" if parsed.query else "")
        request = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        ).encode("ascii")
        self.socket.sendall(request)
        response = self._read_headers()
        expected = base64.b64encode(
            hashlib.sha1((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode("ascii")).digest()
        ).decode("ascii")
        if "101" not in response.split("\r\n", 1)[0] or f"sec-websocket-accept: {expected}".lower() not in response.lower():
            raise BrowserError("Chromium DevTools WebSocket handshake failed.")
        self.next_id = 0

    def _read_headers(self) -> str:
        data = bytearray()
        while b"\r\n\r\n" not in data:
            chunk = self.socket.recv(1)
            if not chunk:
                raise BrowserError("Chromium closed the DevTools connection during handshake.")
            data.extend(chunk)
        return data.decode("iso-8859-1")

    def _read_exact(self, length: int) -> bytes:
        chunks = bytearray()
        while len(chunks) < length:
            chunk = self.socket.recv(length - len(chunks))
            if not chunk:
                raise BrowserError("Chromium closed the DevTools connection.")
            chunks.extend(chunk)
        return bytes(chunks)

    def _send_frame(self, opcode: int, payload: bytes) -> None:
        mask = secrets.token_bytes(4)
        length = len(payload)
        if length < 126:
            header = bytes((0x80 | opcode, 0x80 | length))
        elif length < 65536:
            header = bytes((0x80 | opcode, 0x80 | 126)) + struct.pack("!H", length)
        else:
            header = bytes((0x80 | opcode, 0x80 | 127)) + struct.pack("!Q", length)
        masked = bytes(value ^ mask[index % 4] for index, value in enumerate(payload))
        self.socket.sendall(header + mask + masked)

    def _receive_frame(self) -> tuple[int, bytes]:
        first, second = self._read_exact(2)
        opcode = first & 0x0F
        masked = bool(second & 0x80)
        length = second & 0x7F
        if length == 126:
            length = struct.unpack("!H", self._read_exact(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self._read_exact(8))[0]
        mask = self._read_exact(4) if masked else b""
        payload = self._read_exact(length)
        if masked:
            payload = bytes(value ^ mask[index % 4] for index, value in enumerate(payload))
        return opcode, payload

    def command(self, method: str, params: dict | None = None) -> dict:
        self.next_id += 1
        message_id = self.next_id
        payload = {"id": message_id, "method": method}
        if params:
            payload["params"] = params
        self._send_frame(1, json.dumps(payload, separators=(",", ":")).encode("utf-8"))
        fragments: list[bytes] = []
        while True:
            opcode, message = self._receive_frame()
            if opcode == 8:
                raise BrowserError("Chromium closed the DevTools connection before responding.")
            if opcode == 9:
                self._send_frame(10, message)
                continue
            if opcode == 1:
                fragments = [message]
            elif opcode == 0:
                fragments.append(message)
            else:
                continue
            try:
                response = json.loads(b"".join(fragments))
            except json.JSONDecodeError:
                continue
            if response.get("id") != message_id:
                continue
            if "error" in response:
                raise BrowserError(f"Chromium command {method} failed: {response['error'].get('message', response['error'])}")
            return response.get("result", {})

    def close(self) -> None:
        try:
            self._send_frame(8, b"")
        finally:
            self.socket.close()


def http_json(url: str, method: str = "GET") -> dict:
    request = urllib.request.Request(url, method=method)
    with urllib.request.urlopen(request, timeout=2) as response:
        return json.load(response)


def evaluate(browser: DevToolsSocket, expression: str) -> object:
    result = browser.command(
        "Runtime.evaluate",
        {"expression": expression, "awaitPromise": True, "returnByValue": True},
    )
    if "exceptionDetails" in result:
        raise BrowserError(f"Browser evaluation failed: {result['exceptionDetails'].get('text', 'unknown exception')}")
    return result.get("result", {}).get("value")


def wait_for_complete(browser: DevToolsSocket, route: str, label: str | None = None) -> None:
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if evaluate(browser, "[document.readyState, location.pathname]") == ["complete", route]:
            time.sleep(0.15)
            return
        time.sleep(0.05)
    raise BrowserError(f"Timed out rendering {label or route} in Chromium.")


def set_viewport(browser: DevToolsSocket, width: int, height: int) -> None:
    browser.command(
        "Emulation.setDeviceMetricsOverride",
        {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": False},
    )


def open_page(debug_url: str, origin: str, route: str) -> DevToolsSocket:
    target_url = origin + route
    endpoint = debug_url + "/json/new?" + urllib.parse.quote(target_url, safe=":/?=&")
    try:
        target = http_json(endpoint, method="PUT")
    except Exception as error:
        raise BrowserError(f"Could not open {route} in Chromium: {error}") from error
    return DevToolsSocket(target["webSocketDebuggerUrl"])


class ChromiumSession:
    def __init__(self, document_root: Path) -> None:
        self.document_root = document_root
        self.server: http.server.ThreadingHTTPServer | None = None
        self.server_thread: threading.Thread | None = None
        self.profile: tempfile.TemporaryDirectory[str] | None = None
        self.process: subprocess.Popen[bytes] | None = None
        self.origin = ""
        self.debug_url = ""

    def __enter__(self) -> ChromiumSession:
        if not self.document_root.is_dir():
            raise BrowserError(f"Missing site directory: {self.document_root}")
        chromium = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
        if not chromium:
            raise BrowserError("Missing Chromium; install chromium to run browser acceptance checks.")

        self.server = http.server.ThreadingHTTPServer(
            ("127.0.0.1", 0),
            functools.partial(QuietFileServer, directory=str(self.document_root)),
        )
        self.server_thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.server_thread.start()
        self.origin = f"http://127.0.0.1:{self.server.server_port}"

        with socket.socket() as port_socket:
            port_socket.bind(("127.0.0.1", 0))
            debug_port = port_socket.getsockname()[1]
        self.profile = tempfile.TemporaryDirectory(prefix="chromium-")
        self.process = subprocess.Popen(
            [
                chromium,
                "--headless=new",
                f"--remote-debugging-port={debug_port}",
                "--remote-debugging-address=127.0.0.1",
                f"--user-data-dir={self.profile.name}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-background-networking",
                "--disable-component-update",
                "--disable-sync",
                "--metrics-recording-only",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        self.debug_url = f"http://127.0.0.1:{debug_port}"
        deadline = time.monotonic() + 15
        while True:
            try:
                http_json(self.debug_url + "/json/version")
                return self
            except Exception:
                if time.monotonic() >= deadline:
                    self.close()
                    raise BrowserError("Chromium did not expose its DevTools endpoint within 15 seconds.")
                time.sleep(0.05)

    def open_page(self, route: str) -> DevToolsSocket:
        return open_page(self.debug_url, self.origin, route)

    def close(self) -> None:
        if self.process:
            try:
                os.killpg(self.process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            if self.process.poll() is None:
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(self.process.pid, signal.SIGKILL)
                    self.process.wait(timeout=5)
        if self.profile:
            self.profile.cleanup()
        if self.server:
            self.server.shutdown()
            self.server.server_close()

    def __exit__(self, *_: object) -> None:
        self.close()
