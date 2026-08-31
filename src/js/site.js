import { initDrawer } from "./drawer.js";
import { initHeader } from "./header.js";
import { initQuake } from "./quake.js";
import { initWordmark } from "./wordmark.js";
import { initNewsSearch } from "./news.js";

const init = () => {
  const header = initHeader();
  initDrawer();
  initQuake({ header });
  initWordmark();
  initNewsSearch();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
