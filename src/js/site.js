import { initDrawer } from "./drawer.js";
import { initHeader } from "./header.js";
import { initHomeHero } from "./home-hero.js";
import { initQuake } from "./quake.js";
import { initWordmark } from "./wordmark.js";
import { initSiteSearch } from "./search.js";

const init = () => {
  const header = initHeader();
  initDrawer();
  initHomeHero();
  const quake = initQuake({ header });
  initWordmark();
  initSiteSearch({ quake });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
