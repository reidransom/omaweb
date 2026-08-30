import { initDrawer } from "./drawer.js";
import { initHeader } from "./header.js";

const init = () => {
  initHeader();
  initDrawer();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
