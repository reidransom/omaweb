#!/usr/bin/env node

import {
  BrowserError,
  ChromiumSession,
  evaluate,
  setViewport,
  waitForComplete,
} from "./support/browser.mjs";

import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const SITE = resolve("_site");
const VIEWPORTS = [[390, 844], [768, 1024], [1440, 900]];
const CHOREOGRAPHY_END = 0.75;
const ROUTES = [
  "/",
  "/desktop/",
  "/new-releases/",
  "/accessories/",
  "/search/",
  "/news/",
  "/news/2026/08/the-first-plugin-competition-winners/",
  "/news/categories/product/",
  "/workstations/",
  "/teams/",
  "/meetups/",
  "/patrons/",
  "/community/featured-videos/",
  "/manual/",
  "/manual/getting-started/",
  "/brand/",
  "/screensaver/",
];

const HERO_METRICS = `(() => {
  const hero = document.querySelector("[data-home-hero]");
  const stage = hero.querySelector("[data-home-hero-stage]");
  const primary = hero.querySelector("[data-home-hero-primary]");
  const media = hero.querySelector("[data-home-hero-media]");
  const columns = [1, 2, 3].map(number =>
    hero.querySelector(\`[data-home-hero-column="\${number}"]\`)
  );
  const posters = [...hero.querySelectorAll("[data-home-hero-poster]")];
  const viewAll = hero.querySelector("[data-home-hero-view-all]");
  const news = document.querySelector("#home-news");
  const announcement = document.querySelector(".announcement");
  const siteHeader = document.querySelector(".site-header");
  const rect = element => {
    const value = element.getBoundingClientRect();
    return {
      left: value.left,
      right: value.right,
      top: value.top,
      bottom: value.bottom,
      width: value.width,
      height: value.height
    };
  };
  const isVisible = element => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number.parseFloat(style.opacity) > 0.01 &&
      bounds.width > 0 &&
      bounds.height > 0;
  };
  const isFocusable = element =>
    element.tabIndex >= 0 && !element.closest("[inert]") && isVisible(element);
  const details = element => {
    const style = getComputedStyle(element);
    const transform = style.transform;
    return {
      rect: rect(element),
      visible: isVisible(element),
      focusable: isFocusable(element),
      tabIndex: element.tabIndex,
      transform,
      transformTarget: element.style.transform,
      visibility: style.visibility,
      pointerEvents: style.pointerEvents,
      position: style.position,
      inert: element.hasAttribute("inert")
    };
  };
  const inlineMotion = element =>
    ['inline-size', 'opacity', 'pointer-events', 'transform', 'visibility'].some(property => element.style.getPropertyValue(property) !== "");

  return {
    scrollY,
    innerWidth,
    innerHeight,
    enhanced: hero.hasAttribute("data-home-hero-enhanced"),
    animating: document.body.hasAttribute("data-home-hero-panels-animating"),
    horizontalOverflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 ||
      document.body.scrollWidth > document.body.clientWidth + 1,
    hero: details(hero),
    stage: details(stage),
    primary: details(primary),
    announcement: details(announcement),
    siteHeader: details(siteHeader),
    media: details(media),
    columns: columns.map(details),
    actions: [...primary.querySelectorAll("a[href]")].map(link => ({
      text: link.textContent.trim(),
      href: link.href,
      focusable: isFocusable(link),
      tabIndex: link.tabIndex
    })),
    posters: posters.map(link => {
      const image = link.querySelector("img");
      const overlay = link.querySelector(".home-hero__poster-overlay");
      const title = link.querySelector(".home-hero__poster-title");
      const creator = link.querySelector(".home-hero__poster-creator");
      const titleStyle = getComputedStyle(title);
      const lineHeight = Number.parseFloat(titleStyle.lineHeight);
      return {
        ...details(link),
        href: link.href,
        target: link.getAttribute("target"),
        ariaLabel: link.getAttribute("aria-label"),
        imageAlt: image.getAttribute("alt"),
        imageRect: rect(image),
        objectFit: getComputedStyle(image).objectFit,
        objectPosition: getComputedStyle(image).objectPosition,
        overlayVisible: isVisible(overlay),
        title: title.textContent.trim(),
        creator: creator.textContent.trim(),
        titleLines: lineHeight > 0 ? title.getBoundingClientRect().height / lineHeight : 99,
        playHidden: link.querySelector(".video__play")?.getAttribute("aria-hidden") === "true"
      };
    }),
    viewAll: {
      ...details(viewAll),
      href: viewAll.href,
      text: viewAll.textContent.trim()
    },
    news: details(news),
    inlineMotion: [primary, ...columns, viewAll].some(inlineMotion),
    mediaElements: hero.querySelectorAll("iframe, video, audio, embed, object").length
  };
})()`;

class VerificationError extends Error {}

function fail(message) {
  throw new VerificationError(message);
}

function require(condition, message) {
  if (!condition) fail(message);
}

function closeEnough(first, second, tolerance = 2) {
  return Math.abs(first - second) <= tolerance;
}

async function settle(browser) {
  await evaluate(
    browser,
    `new Promise(resolve => requestAnimationFrame(() =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    ))`,
  );
}

async function loadPage(
  session,
  route,
  width,
  height,
  { reducedMotion = false, javascript = true } = {},
) {
  const browser = await session.openPage(route);
  await browser.command("Page.enable");
  await setViewport(browser, width, height);
  if (reducedMotion) {
    await browser.command("Emulation.setEmulatedMedia", {
      media: "",
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
  }
  if (!javascript) {
    await browser.command("Page.setLifecycleEventsEnabled", { enabled: true });
    await browser.command("Emulation.setScriptExecutionDisabled", { value: true });
  }
  const navigation = await browser.command("Page.navigate", {
    url: session.origin + route,
  });
  if (!javascript) {
    for (;;) {
      const lifecycle = await browser.waitForEvent("Page.lifecycleEvent");
      if (
        lifecycle.name === "load" &&
        lifecycle.loaderId === navigation.loaderId
      ) break;
    }
    await browser.command("Emulation.setScriptExecutionDisabled", { value: false });
  }
  await waitForComplete(browser, route);
  await settle(browser);
  return browser;
}

async function checkPage(browser, route, width, height) {
  await evaluate(
    browser,
    `new Promise(async resolve => {
      for (const image of document.images) {
        image.scrollIntoView({block: "center"});
        await new Promise(done => setTimeout(done, 20));
      }
      await Promise.all([...document.images].map(image => image.decode().catch(() => undefined)));
      window.scrollTo(0, 0);
      resolve();
    })`,
  );
  const metrics = await evaluate(
    browser,
    `(() => ({
      body: Boolean(document.body),
      title: document.title.trim(),
      images: Array.from(document.images, image => ({
        src: image.currentSrc || image.src,
        complete: image.complete,
        naturalWidth: image.naturalWidth
      }))
    }))()`,
  );
  if (!metrics.body || !metrics.title) {
    fail(`${route} at ${width}x${height} must render a document body and title.`);
  }
  for (const image of metrics.images) {
    if (!image.complete || image.naturalWidth <= 0) {
      fail(`${route} renders an unloaded or broken image: ${image.src}.`);
    }
  }
}

async function heroMetrics(browser) {
  return await evaluate(browser, HERO_METRICS);
}

async function scrollRange(browser) {
  return await evaluate(
    browser,
    `(() => {
      const hero = document.querySelector("[data-home-hero]");
      const bounds = hero.getBoundingClientRect();
      const top = scrollY + bounds.top;
      return {start: top, end: top + bounds.height - innerHeight};
    })()`,
  );
}

async function scrollTo(browser, position) {
  await evaluate(
    browser,
    `new Promise(resolve => {
      window.scrollTo({top: ${position}, left: 0, behavior: "instant"});
      requestAnimationFrame(() => requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      ));
    })`,
  );
}

async function snapshotAt(browser, limits, progress) {
  const position = limits.start + (limits.end - limits.start) * progress;
  await scrollTo(browser, Math.max(0, position));
  return await heroMetrics(browser);
}

async function choreographySnapshot(browser, limits, progress) {
  return await snapshotAt(browser, limits, progress / CHOREOGRAPHY_END);
}

function requireNoOverflow(snapshot, label) {
  require(!snapshot.horizontalOverflow, `${label} introduces horizontal document overflow.`);
}

function visibleColumnNumbers(snapshot) {
  return snapshot.columns
    .map((column, index) => column.visible ? index + 1 : null)
    .filter(index => index !== null);
}

function requireFocusState(snapshot, posterIndexes, { viewAll, label }) {
  for (const [index, poster] of snapshot.posters.entries()) {
    require(
      poster.focusable === posterIndexes.includes(index),
      `${label} exposes the wrong sequential focus state for poster ${index + 1}.`,
    );
  }
  require(
    snapshot.viewAll.focusable === viewAll,
    `${label} exposes the wrong sequential focus state for View all.`,
  );
}

function requireOffstageRegion(snapshot, region, label) {
  const stage = snapshot.media.rect;
  const bounds = region.rect;
  require(
    bounds.right <= stage.left || bounds.left >= stage.right,
    `${label} must remain outside the clipped media stage.`,
  );
  require(
    region.inert &&
      region.visibility === "hidden" &&
      region.pointerEvents === "none",
    `${label} must be inert, hidden, and pointer-disabled while off-stage.`,
  );
}

function requireRectClose(first, second, label) {
  for (const key of ["left", "top", "width", "height"]) {
    require(
      closeEnough(first[key], second[key]),
      `${label} changed ${key} between equivalent scroll positions.`,
    );
  }
}

async function readFeaturedContract(session) {
  const browser = await loadPage(session, "/community/featured-videos/", 1440, 900);
  try {
    const items = await evaluate(
      browser,
      `[...document.querySelectorAll(".featured-video__facade")].map(link => ({
        href: link.href,
        target: link.getAttribute("target")
      }))`,
    );
    require(items.length === 5, "Featured videos must retain its complete five-item collection.");
    for (const [index, item] of items.entries()) {
      require(
        item.href.startsWith("https://www.youtube.com/watch?v="),
        `Featured video ${index + 1} must retain its YouTube watch destination.`,
      );
      require(item.target === null, `Featured video ${index + 1} must navigate in the same tab.`);
    }
    return items;
  } finally {
    await browser.close();
  }
}

async function requireLinkContract(browser, snapshot, featuredContract, label) {
  require(
    snapshot.posters.length === featuredContract.length,
    `${label} must retain the complete featured-video link contract.`,
  );
  for (let index = 0; index < snapshot.posters.length; index++) {
    const poster = snapshot.posters[index];
    const expected = featuredContract[index];
    const accessibleName = `Watch ${poster.title} by ${poster.creator} on YouTube`;
    const imageAlt = `${poster.title} by ${poster.creator}`;
    require(poster.href === expected.href, `${label} poster ${index + 1} has the wrong destination.`);
    require(poster.target === null, `${label} poster ${index + 1} must navigate in the same tab.`);
    require(
      poster.ariaLabel === accessibleName,
      `${label} poster ${index + 1} has the wrong accessible name.`,
    );
    require(
      poster.imageAlt === imageAlt,
      `${label} poster ${index + 1} has the wrong image alternative.`,
    );
    require(poster.playHidden, `${label} poster ${index + 1} exposes decorative play artwork.`);
  }

  require(
    snapshot.viewAll.href.endsWith("/community/featured-videos/"),
    `${label} View all must point to the Featured videos collection.`,
  );
  const tree = await browser.command("Accessibility.getFullAXTree");
  const accessibleLinks = tree.nodes
    .filter(node => !node.ignored && node.role?.value === "link")
    .map(node => node.name?.value);
  for (const poster of snapshot.posters) {
    const accessibleName = `Watch ${poster.title} by ${poster.creator} on YouTube`;
    require(
      accessibleLinks.filter(name => name === accessibleName).length === 1,
      `${label} must expose one accessible link for ${accessibleName}.`,
    );
  }
}

async function requireFocusIndicators(browser, label) {
  await browser.command("Input.dispatchKeyEvent", {
    type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9,
  });
  await browser.command("Input.dispatchKeyEvent", {
    type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9,
  });
  const indicators = await evaluate(
    browser,
    `new Promise(async resolve => {
      const controls = [
        ...document.querySelectorAll("[data-home-hero-poster]"),
        document.querySelector("[data-home-hero-view-all]")
      ];
      const results = [];
      for (const control of controls) {
        control.focus({preventScroll: true});
        await new Promise(done => requestAnimationFrame(done));
        const style = getComputedStyle(control);
        results.push({
          active: document.activeElement === control,
          focusVisible: control.matches(":focus-visible"),
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth)
        });
      }
      resolve(results);
    })`,
  );
  for (const [index, indicator] of indicators.entries()) {
    const name = index < 5 ? `poster ${index + 1}` : "View all";
    require(indicator.active, `${label} ${name} cannot receive keyboard focus.`);
    require(
      indicator.focusVisible &&
        indicator.outlineStyle !== "none" &&
        indicator.outlineWidth > 0,
      `${label} ${name} lacks a visible keyboard focus indicator.`,
    );
  }
}

async function focusPrimaryAction(browser) {
  const focused = await evaluate(
    browser,
    `(() => {
      const action = document.querySelector("[data-home-hero-primary] a[href]");
      action.focus({preventScroll: true});
      return document.activeElement === action;
    })()`,
  );
  require(focused, "Could not focus the primary hero action before the forward-scroll check.");
}

async function focusPoster(browser, index) {
  const focused = await evaluate(
    browser,
    `(() => {
      const poster = document.querySelectorAll("[data-home-hero-poster]")[${index}];
      poster.focus({preventScroll: true});
      return document.activeElement === poster;
    })()`,
  );
  require(focused, `Could not focus poster ${index + 1} before reverse-scroll check.`);
}

async function activeFocus(browser) {
  return await evaluate(
    browser,
    `(() => {
      const active = document.activeElement;
      const posters = [...document.querySelectorAll("[data-home-hero-poster]")];
      const primary = document.querySelector("[data-home-hero-primary]");
      const style = getComputedStyle(active);
      return {
        poster: posters.indexOf(active),
        inPrimary: primary.contains(active),
        visible: style.visibility !== "hidden" &&
          !active.closest("[inert]") &&
          active.getBoundingClientRect().width > 0
      };
    })()`,
  );
}

function requireFinalGeometry(snapshot, label) {
  const columns = snapshot.columns;
  require(
    JSON.stringify(visibleColumnNumbers(snapshot)) === JSON.stringify([1, 2, 3]),
    `${label} must show all three columns.`,
  );
  require(
    columns[1].rect.left < columns[0].rect.left &&
      columns[0].rect.left < columns[2].rect.left,
    `${label} must order the final columns as 2–3, 1, 4–5.`,
  );
  require(
    closeEnough(columns[0].rect.width, columns[1].rect.width) &&
      closeEnough(columns[1].rect.width, columns[2].rect.width),
    `${label} must form three equal-width columns.`,
  );
  require(
    closeEnough(snapshot.posters[1].rect.height, snapshot.posters[2].rect.height) &&
      closeEnough(snapshot.posters[3].rect.height, snapshot.posters[4].rect.height),
    `${label} must divide the center and right columns into equal-height cells.`,
  );
  require(
    snapshot.posters[0].rect.bottom < snapshot.viewAll.rect.top &&
      closeEnough(snapshot.posters[0].rect.width, snapshot.viewAll.rect.width),
    `${label} must place View all directly below poster 1 in the first column.`,
  );
  for (const [index, poster] of snapshot.posters.entries()) {
    require(poster.overlayVisible, `${label} must keep poster ${index + 1}'s overlay visible.`);
    require(poster.title && poster.creator, `${label} poster ${index + 1} lacks visible metadata.`);
    require(poster.titleLines <= 2.1, `${label} poster ${index + 1} exceeds two title lines.`);
    require(poster.objectFit === "cover", `${label} poster ${index + 1} must crop with object-fit cover.`);
    const columnIndex = index === 0 ? 0 : index < 3 ? 1 : 2;
    require(
      closeEnough(poster.rect.left, columns[columnIndex].rect.left) &&
        closeEnough(poster.rect.width, columns[columnIndex].rect.width),
      `${label} poster ${index + 1} link must span its complete media column.`,
    );
  }
  require(snapshot.viewAll.visible, `${label} must reveal View all after column 3 settles.`);
  if (snapshot.enhanced) {
    require(
      ["translateY(0)", "translateY(0px)"].includes(snapshot.viewAll.transformTarget),
      `${label} must target zero vertical translation for View all.`,
    );
  }
  require(snapshot.mediaElements === 0, `${label} must render posters rather than playable media.`);
  requireNoOverflow(snapshot, label);
}

async function verifyNormalChoreography(session, width, height, featuredContract) {
  const label = `Homepage at ${width}x${height}`;
  const browser = await loadPage(session, "/", width, height);
  try {
    const opening = await heroMetrics(browser);
    require(opening.primary.visible, `${label} must open on the OMARCHY panel.`);
    const actionText = opening.actions.map(action => action.text).join(" ");
    require(actionText.includes("ISO") && actionText.includes("Manual"), `${label} must expose ISO and Manual actions.`);
    require(opening.actions.every(action => action.focusable), `${label} opening actions must participate in sequential focus.`);
    requireFocusState(opening, [], { viewAll: false, label: `${label} opening state` });
    requireNoOverflow(opening, `${label} opening state`);

    const limits = await scrollRange(browser);
    const progressPoints = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75];
    const frames = {};
    for (const progress of progressPoints) {
      frames[progress] = await choreographySnapshot(browser, limits, progress);
    }

    const stageGap = opening.columns[0].rect.left - opening.media.rect.right;
    require(stageGap > 0, `${label} must stage entering columns beyond the clipping edge.`);
    const seamDelta = 0.125 * stageGap / (opening.media.rect.width + stageGap);
    const enteringSeams = [
      ["first-column entry seam", seamDelta, 0, []],
      ["second-column entry seam", 0.25 + seamDelta, 1, [0]],
      ["third-column entry seam", 0.5 + seamDelta, 2, [0, 1, 2]],
    ];
    for (const [seamLabel, progress, columnIndex, focusablePosters] of enteringSeams) {
      const seam = await choreographySnapshot(browser, limits, progress);
      requireOffstageRegion(seam, seam.columns[columnIndex], `${label} ${seamLabel}`);
      requireFocusState(seam, focusablePosters, {
        viewAll: false, label: `${label} ${seamLabel}`,
      });
    }

    await choreographySnapshot(browser, limits, 0.125);
    await focusPrimaryAction(browser);
    const primaryExitSeam = await choreographySnapshot(browser, limits, 0.25 - seamDelta);
    let focus = await activeFocus(browser);
    require(
      focus.visible && focus.poster === 0,
      `${label} must move focus out of the off-stage primary panel.`,
    );
    requireOffstageRegion(primaryExitSeam, primaryExitSeam.primary, `${label} primary-panel exit seam`);
    require(
      primaryExitSeam.actions.every(action => !action.focusable),
      `${label} primary-panel exit seam must remove its actions from sequential focus.`,
    );
    requireFocusState(primaryExitSeam, [0], {
      viewAll: false, label: `${label} primary-panel exit seam`,
    });
    for (const progress of progressPoints) {
      requireNoOverflow(frames[progress], `${label} at ${progress.toFixed(3)} progress`);
    }

    require(
      frames[0].primary.rect.left > frames[0.125].primary.rect.left &&
        frames[0.125].primary.rect.left > frames[0.25].primary.rect.left,
      `${label} must move the OMARCHY panel left during the first interval.`,
    );
    require(
      frames[0].columns[0].rect.left > frames[0.125].columns[0].rect.left &&
        frames[0.125].columns[0].rect.left > frames[0.25].columns[0].rect.left,
      `${label} must bring poster 1 in from the right.`,
    );
    require(
      JSON.stringify(visibleColumnNumbers(frames[0.25])) === JSON.stringify([1]) &&
        !frames[0.25].primary.visible,
      `${label} first milestone must contain only poster 1.`,
    );
    require(
      closeEnough(frames[0.25].columns[0].rect.width, frames[0.25].media.rect.width) &&
        closeEnough(frames[0.25].columns[0].rect.left, frames[0.25].media.rect.left),
      `${label} first milestone must make poster 1 fill the stage.`,
    );
    requireFocusState(frames[0.25], [0], {
      viewAll: false, label: `${label} first milestone`,
    });

    require(
      frames[0.25].columns[1].rect.left < frames[0.375].columns[1].rect.left &&
        frames[0.375].columns[1].rect.left < frames[0.5].columns[1].rect.left,
      `${label} must bring posters 2–3 in from the left.`,
    );
    require(
      frames[0.25].columns[0].rect.width > frames[0.375].columns[0].rect.width &&
        frames[0.375].columns[0].rect.width > frames[0.5].columns[0].rect.width,
      `${label} must compress poster 1 continuously during the second interval.`,
    );
    require(
      frames[0.25].columns[0].rect.left < frames[0.375].columns[0].rect.left &&
        frames[0.375].columns[0].rect.left < frames[0.5].columns[0].rect.left,
      `${label} must shift poster 1 right while posters 2–3 enter on its left.`,
    );
    require(
      JSON.stringify(visibleColumnNumbers(frames[0.5])) === JSON.stringify([1, 2]) &&
        frames[0.5].columns[1].rect.left < frames[0.5].columns[0].rect.left &&
        closeEnough(frames[0.5].columns[0].rect.width, frames[0.5].columns[1].rect.width),
      `${label} second milestone must place equal-width posters 2–3 left of poster 1.`,
    );
    requireFocusState(frames[0.5], [0, 1, 2], {
      viewAll: false, label: `${label} second milestone`,
    });

    require(
      frames[0.5].columns[2].rect.left > frames[0.625].columns[2].rect.left &&
        frames[0.625].columns[2].rect.left > frames[0.75].columns[2].rect.left,
      `${label} must bring posters 4–5 in from the right.`,
    );
    for (const columnIndex of [0, 1]) {
      require(
        frames[0.5].columns[columnIndex].rect.width >
          frames[0.625].columns[columnIndex].rect.width &&
          frames[0.625].columns[columnIndex].rect.width >
          frames[0.75].columns[columnIndex].rect.width,
        `${label} must compress column ${columnIndex + 1} continuously in the third interval.`,
      );
    }
    requireFinalGeometry(frames[0.75], `${label} completed milestone`);
    requireFocusState(frames[0.75], [0, 1, 2, 3, 4], {
      viewAll: true, label: `${label} completed milestone`,
    });
    for (const progress of [0.25, 0.375, 0.5, 0.625, 0.75]) {
      require(
        frames[progress].posters[0].objectPosition === "50% 50%",
        `${label} must keep poster 1's centered crop stable through compression.`,
      );
    }

    const thirdLateStart = await snapshotAt(browser, limits, 0.8);
    const thirdLateEnd = await snapshotAt(browser, limits, 0.95);
    require(
      thirdLateEnd.scrollY - thirdLateStart.scrollY > height * 0.3,
      `${label} final panel entrance must consume the remaining scroll interval.`,
    );
    require(
      closeEnough(thirdLateStart.stage.rect.top, thirdLateEnd.stage.rect.top),
      `${label} stage must remain pinned until the final panel lands.`,
    );
    for (const index of [0, 1]) {
      require(
        thirdLateStart.columns[index].rect.width > thirdLateEnd.columns[index].rect.width,
        `${label} must keep compressing column ${index + 1} until downward scroll resumes.`,
      );
    }
    require(
      thirdLateStart.columns[2].rect.left > thirdLateEnd.columns[2].rect.left,
      `${label} must keep the right panel moving until downward scroll resumes.`,
    );
    require(
      !thirdLateStart.viewAll.visible && !thirdLateEnd.viewAll.visible,
      `${label} must reveal View all only when the final panel lands.`,
    );

    const chromeRelease = [];
    for (const progress of [0.96, 0.98, 0.995]) {
      chromeRelease.push(await snapshotAt(browser, limits, progress));
    }
    require(
      chromeRelease.every(frame => frame.announcement.position === "sticky"),
      `${label} announcement must remain sticky while it scrolls out.`,
    );
    require(
      chromeRelease[0].announcement.rect.top > chromeRelease[1].announcement.rect.top &&
        chromeRelease[1].announcement.rect.top > chromeRelease[2].announcement.rect.top,
      `${label} announcement must scroll smoothly upward before hero release.`,
    );
    require(
      chromeRelease[0].siteHeader.rect.top > chromeRelease[1].siteHeader.rect.top &&
        chromeRelease[1].siteHeader.rect.top > chromeRelease[2].siteHeader.rect.top,
      `${label} site header must smoothly replace the departing announcement.`,
    );
    require(
      chromeRelease[0].stage.rect.top > chromeRelease[1].stage.rect.top &&
        chromeRelease[1].stage.rect.top > chromeRelease[2].stage.rect.top,
      `${label} video stage must rise continuously with the departing page chrome.`,
    );

    await scrollTo(browser, limits.end + height * 0.35);
    const released = await heroMetrics(browser);
    require(!released.animating, `${label} must finish animation state when the final panel lands.`);
    require(
      released.stage.rect.top < thirdLateEnd.stage.rect.top - height * 0.2,
      `${label} sticky stage must release as soon as the final panel lands.`,
    );
    require(
      released.news.rect.top < height && released.news.rect.bottom > 0,
      `${label} must release into ordinary News flow.`,
    );
    requireNoOverflow(released, `${label} after sticky release`);

    await choreographySnapshot(browser, limits, 0.75);
    await focusPoster(browser, 4);
    const reverse625 = await choreographySnapshot(browser, limits, 0.625);
    requireRectClose(reverse625.columns[2].rect, frames[0.625].columns[2].rect, `${label} reverse third interval`);
    requireFocusState(reverse625, [0, 1, 2, 3, 4], {
      viewAll: false, label: `${label} reverse third interval`,
    });

    const reverseThirdSeam = await choreographySnapshot(browser, limits, 0.5 + seamDelta);
    focus = await activeFocus(browser);
    require(
      focus.visible && [0, 1, 2].includes(focus.poster),
      `${label} must move focus out of off-stage column 3.`,
    );
    requireOffstageRegion(reverseThirdSeam, reverseThirdSeam.columns[2], `${label} reverse third-column exit seam`);
    requireFocusState(reverseThirdSeam, [0, 1, 2], {
      viewAll: false, label: `${label} reverse third-column exit seam`,
    });
    require(
      reverseThirdSeam.viewAll.transformTarget === "translateY(var(--omarchy-space-small))",
      `${label} must restore hidden View all to its translated entrance offset.`,
    );

    const reverse500 = await choreographySnapshot(browser, limits, 0.5);
    focus = await activeFocus(browser);
    require(
      focus.visible && [0, 1, 2].includes(focus.poster),
      `${label} must move focus out of hidden column 3.`,
    );
    requireRectClose(reverse500.columns[0].rect, frames[0.5].columns[0].rect, `${label} reverse second milestone`);
    requireFocusState(reverse500, [0, 1, 2], {
      viewAll: false, label: `${label} reverse second milestone`,
    });

    await focusPoster(browser, 2);
    const reverse375 = await choreographySnapshot(browser, limits, 0.375);
    requireRectClose(reverse375.columns[1].rect, frames[0.375].columns[1].rect, `${label} reverse second interval`);
    requireFocusState(reverse375, [0, 1, 2], {
      viewAll: false, label: `${label} reverse second interval`,
    });

    const reverseSecondSeam = await choreographySnapshot(browser, limits, 0.25 + seamDelta);
    focus = await activeFocus(browser);
    require(
      focus.visible && focus.poster === 0,
      `${label} must move focus out of off-stage column 2.`,
    );
    requireOffstageRegion(reverseSecondSeam, reverseSecondSeam.columns[1], `${label} reverse second-column exit seam`);
    requireFocusState(reverseSecondSeam, [0], {
      viewAll: false, label: `${label} reverse second-column exit seam`,
    });

    const reverse250 = await choreographySnapshot(browser, limits, 0.25);
    focus = await activeFocus(browser);
    require(focus.visible && focus.poster === 0, `${label} must move focus out of hidden column 2.`);
    requireFocusState(reverse250, [0], {
      viewAll: false, label: `${label} reverse first milestone`,
    });

    await focusPoster(browser, 0);
    const reverse125 = await choreographySnapshot(browser, limits, 0.125);
    requireRectClose(reverse125.primary.rect, frames[0.125].primary.rect, `${label} reverse first interval`);

    const reverseFirstSeam = await choreographySnapshot(browser, limits, seamDelta);
    focus = await activeFocus(browser);
    require(
      focus.visible && focus.inPrimary,
      `${label} must move focus out of off-stage column 1.`,
    );
    requireOffstageRegion(reverseFirstSeam, reverseFirstSeam.columns[0], `${label} reverse first-column exit seam`);
    requireFocusState(reverseFirstSeam, [], {
      viewAll: false, label: `${label} reverse first-column exit seam`,
    });

    const restored = await choreographySnapshot(browser, limits, 0);
    focus = await activeFocus(browser);
    require(
      focus.visible && focus.inPrimary,
      `${label} must move focus back to the restored OMARCHY panel.`,
    );
    require(
      restored.primary.visible && visibleColumnNumbers(restored).length === 0,
      `${label} must fully restore its opening state when scrolling backward.`,
    );
    requireFocusState(restored, [], {
      viewAll: false, label: `${label} restored opening state`,
    });

    const completed = await choreographySnapshot(browser, limits, 0.75);
    await requireLinkContract(browser, completed, featuredContract, label);

    if (width === 1440) {
      await requireFocusIndicators(browser, label);
      await choreographySnapshot(browser, limits, 0);
      await evaluate(
        browser,
        `new Promise(resolve => {
          document.querySelector(".home-scroll-cue").click();
          setTimeout(() => {
            let previous = scrollY;
            let stableFrames = 0;
            const deadline = performance.now() + 4000;
            const check = () => {
              if (Math.abs(scrollY - previous) < 0.5) stableFrames += 1;
              else stableFrames = 0;
              previous = scrollY;
              if (stableFrames >= 6 || performance.now() >= deadline) resolve();
              else requestAnimationFrame(check);
            };
            requestAnimationFrame(check);
          }, 100);
        })`,
      );
      const cueResult = await heroMetrics(browser);
      require(
        await evaluate(browser, "location.hash") === "#home-news" &&
          cueResult.news.rect.top < height &&
          cueResult.news.rect.bottom > 0,
        `${label} scroll cue must bypass the pinned interval and reach News.`,
      );
      require(!cueResult.animating, `${label} scroll cue must not leave an intermediate animation state.`);
    }

    if (width === 768) {
      await setViewport(browser, 390, 844);
      await settle(browser);
      await scrollTo(browser, 0);
      const narrow = await heroMetrics(browser);
      require(
        !narrow.enhanced && !narrow.animating && !narrow.inlineMotion,
        `${label} must clear enhancement state when resized below 40rem.`,
      );
      requireFocusState(narrow, [0, 1, 2, 3, 4], {
        viewAll: true, label: `${label} resized static state`,
      });

      await setViewport(browser, width, height);
      await settle(browser);
      await scrollTo(browser, 0);
      const restoredDesktop = await heroMetrics(browser);
      require(
        restoredDesktop.enhanced &&
          restoredDesktop.primary.visible &&
          visibleColumnNumbers(restoredDesktop).length === 0,
        `${label} must initialize one clean opening state after re-entering the breakpoint.`,
      );
    }
  } finally {
    await browser.close();
  }
}

async function requireStaticLayout(
  session,
  width,
  height,
  { reducedMotion = false, javascript = true } = {},
) {
  const mode = reducedMotion ? "reduced motion" : !javascript ? "no JavaScript" : "static";
  const label = `Homepage ${mode} at ${width}x${height}`;
  const browser = await loadPage(session, "/", width, height, {
    reducedMotion,
    javascript,
  });
  try {
    const snapshot = await heroMetrics(browser);
    require(
      !snapshot.enhanced && !snapshot.animating,
      `${label} must not initialize scroll choreography.`,
    );
    require(snapshot.stage.position !== "sticky", `${label} must keep the stage in ordinary flow.`);
    require(snapshot.primary.visible, `${label} must preserve the OMARCHY introduction.`);
    require(
      snapshot.posters.every(poster => poster.visible) && snapshot.viewAll.visible,
      `${label} must expose all five posters followed by View all.`,
    );
    requireFocusState(snapshot, [0, 1, 2, 3, 4], { viewAll: true, label });
    require(!snapshot.inlineMotion, `${label} must not retain inline animation state.`);
    require(
      [snapshot.primary, ...snapshot.columns].every(item => item.transform === "none"),
      `${label} must not apply sideways transforms.`,
    );
    require(
      snapshot.primary.rect.bottom <= snapshot.media.rect.top,
      `${label} must place the poster collection after the introduction.`,
    );
    require(snapshot.mediaElements === 0, `${label} must render static posters rather than playable media.`);
    requireNoOverflow(snapshot, label);

    if (width < 640) {
      const posterTops = snapshot.posters.map(poster => poster.rect.top);
      require(
        posterTops.slice(0, -1).every((first, index) => first < posterTops[index + 1]),
        `${label} must render posters 1–5 in one vertical sequence.`,
      );
      require(
        snapshot.posters.at(-1).rect.bottom < snapshot.viewAll.rect.top,
        `${label} must place View all after poster 5.`,
      );
      const posterWidths = snapshot.posters.map(poster => poster.rect.width);
      require(
        Math.max(...posterWidths) - Math.min(...posterWidths) <= 2,
        `${label} must keep the mobile poster widths equal.`,
      );
    } else {
      requireFinalGeometry(snapshot, label);
      require(
        snapshot.primary.rect.bottom <= snapshot.media.rect.top,
        `${label} must render the completed columns after the introduction.`,
      );
    }
  } finally {
    await browser.close();
  }
}

async function verifyScopedSearch(session) {
  const browser = await loadPage(session, "/search/", 1440, 900);
  try {
    const selected = await evaluate(
      browser,
      `(() => {
        const surface = document.querySelector(".content-shell--search");
        surface.querySelector('[data-search-menu-select][data-search-menu-section="shop"]').click();
        return {
          query: surface.querySelector('input[name="q"]').value,
          rootHidden: surface.querySelector("[data-search-menu-root]").hidden,
          shopPanelVisible: !surface.querySelector('[data-search-menu-panel][data-search-menu-section="shop"]').hidden,
          url: location.search
        };
      })()`,
    );
    require(selected.query === "", "Choosing a section must clear the search query.");
    require(selected.rootHidden && selected.shopPanelVisible, "Choosing Shop must show only its submenu.");
    require(selected.url === "?section=shop", "Choosing a section must update the standalone search URL.");

    const scopedDestination = await evaluate(
      browser,
      `(() => {
        const surface = document.querySelector(".content-shell--search");
        const input = surface.querySelector('input[name="q"]');
        input.value = "Desktop";
        input.dispatchEvent(new Event("input", {bubbles: true}));
        return {
          results: [...surface.querySelectorAll("[data-search-result]")].map(link => new URL(link.href).pathname),
          url: location.search
        };
      })()`,
    );
    require(
      JSON.stringify(scopedDestination.results) === JSON.stringify(["/desktop/"]),
      "Shop search must only render Shop navigation destinations while loading page results.",
    );
    require(
      scopedDestination.url === "?section=shop&q=Desktop",
      "Search query edits must preserve the selected section in the standalone URL.",
    );

    const restored = await evaluate(
      browser,
      `new Promise(resolve => {
        addEventListener("popstate", () => requestAnimationFrame(() => {
          const surface = document.querySelector(".content-shell--search");
          resolve({
            query: surface.querySelector('input[name="q"]').value,
            rootVisible: !surface.querySelector("[data-search-menu-root]").hidden,
            activePanels: [...surface.querySelectorAll("[data-search-menu-panel]")].filter(panel => !panel.hidden).length
          });
        }), {once: true});
        history.back();
      })`,
    );
    require(restored.query === "", "Back must restore the prior empty search query.");
    require(restored.rootVisible && restored.activePanels === 0, "Back must restore All sections.");
  } finally {
    await browser.close();
  }
}

async function verifySearchDefaultSelection(session) {
  const browser = await loadPage(session, "/search/", 1440, 900);
  try {
    const selection = await evaluate(
      browser,
      `(() => {
        const surface = document.querySelector(".content-shell--search");
        const input = surface.querySelector("input[name='q']");
        input.focus();
        input.value = "Desktops";
        input.dispatchEvent(new Event("input", {bubbles: true}));
        const links = [...surface.querySelectorAll("[data-search-result]")];
        return {
          inputFocused: document.activeElement === input,
          firstHref: links[0] ? new URL(links[0].href).pathname : null,
          activeIndex: links.findIndex(link => link.classList.contains("is-active"))
        };
      })()`,
    );
    require(selection.inputFocused, "Search typing must keep focus in the query field.");
    require(selection.firstHref === "/desktop/", "Desktops must render as the first matching result.");
    require(selection.activeIndex === 0, "Search must highlight its first result while typing.");

    await browser.command("Input.dispatchKeyEvent", {
      type: "keyDown", key: "Enter", code: "Enter",
    });
    await waitForComplete(browser, "/desktop/", "first search result navigation");
    require(
      await evaluate(browser, "location.pathname") === "/desktop/",
      "Enter in the search field must navigate to the highlighted first result.",
    );
  } finally {
    await browser.close();
  }
}

async function run() {
  try {
    if (!(await stat(SITE)).isDirectory()) {
      fail("Missing _site; build the rendered site before browser verification.");
    }
  } catch {
    fail("Missing _site; build the rendered site before browser verification.");
  }

  const session = new ChromiumSession(SITE);
  try {
    await session.open();

    const featuredContract = await readFeaturedContract(session);
    await verifyScopedSearch(session);
    await verifySearchDefaultSelection(session);
    await verifyNormalChoreography(session, 1440, 900, featuredContract);
    await verifyNormalChoreography(session, 768, 1024, featuredContract);
    await requireStaticLayout(session, 390, 844);
    await requireStaticLayout(session, 1440, 900, { reducedMotion: true });
    await requireStaticLayout(session, 390, 844, { reducedMotion: true });
    await requireStaticLayout(session, 1440, 900, { javascript: false });
    await requireStaticLayout(session, 390, 844, { javascript: false });

    for (const [width, height] of VIEWPORTS) {
      for (const route of ROUTES) {
        const browser = await loadPage(session, route, width, height);
        try {
          await checkPage(browser, route, width, height);
        } finally {
          await browser.close();
        }
      }
    }
  } finally {
    await session.close();
  }

  console.log(
    `Rendered Chromium checks passed for ${ROUTES.length} routes across ` +
    `${VIEWPORTS.length} viewports, search behavior, and the homepage hero acceptance scenarios.`,
  );
}

try {
  await run();
} catch (error) {
  if (!(error instanceof VerificationError) && !(error instanceof BrowserError)) throw error;
  console.error(`Rendered-site verification failed: ${error.message ?? error}`);
  process.exitCode = 1;
}