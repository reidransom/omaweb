import { initDrawer } from "./drawer.js";
import { initHeader } from "./header.js";
import { initWordmark } from "./wordmark.js";
import { initNewsSearch } from "./news.js";

const init = () => {
  initHeader();
  initDrawer();
  initWordmark();
  initNewsSearch();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
