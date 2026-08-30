import { initDrawer } from "./drawer.js";
import { initHeader } from "./header.js";
import { initWordmark } from "./wordmark.js";

const init = () => {
  initHeader();
  initDrawer();
  initWordmark();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
