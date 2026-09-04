(() => {
  "use strict";

  const script = document.currentScript;
  if (!(script instanceof HTMLScriptElement)) return;

  const website = script.dataset.websiteId;
  const host = script.dataset.hostUrl?.replace(/\/$/, "");
  const domains = script.dataset.domains?.split(",").map(domain => domain.trim());
  const respectsDoNotTrack = script.dataset.doNotTrack === "true";
  const doNotTrack = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;

  if (!website || !host || (domains && !domains.includes(location.hostname))) return;
  if (respectsDoNotTrack && (doNotTrack === "1" || doNotTrack === "yes")) return;

  const referrer = document.referrer.startsWith(location.origin)
    ? document.referrer.slice(location.origin.length)
    : document.referrer;

  void fetch(`${host}/api/send`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      "x-umami-website-id": website,
      "x-umami-hostname": location.hostname,
    },
    body: JSON.stringify({
      type: "event",
      payload: {
        website,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        title: document.title,
        hostname: location.hostname,
        url: location.href,
        referrer,
      },
    }),
  }).catch(() => {});
})();
