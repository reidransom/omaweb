---
layout: product
title: Desktop
description: Omarchy is a current Arch, Hyprland, and Quickshell desktop with terminal-first workflows and room to make the system your own.
permalink: /desktop/
nav_group: platforms
archetype: product
product: desktop
media:
  src: /assets/images/desktop/tokyo-night-preview-1600w.webp
  width: 1600
  height: 900
  alt: Omarchy’s Tokyo Night desktop preview with tiled terminal, system monitor, and file manager windows.
  loading: lazy
  decoding: async
  sizes: "(min-width: 75rem) 68rem, 100vw"
  sources:
    items:
      - type: image/webp
        srcset:
          items:
            - src: /assets/images/desktop/tokyo-night-preview-480w.webp
              width: 480
            - src: /assets/images/desktop/tokyo-night-preview-768w.webp
              width: 768
            - src: /assets/images/desktop/tokyo-night-preview-1200w.webp
              width: 1200
            - src: /assets/images/desktop/tokyo-night-preview-1600w.webp
              width: 1600
---
<style>
  .desktop-proof {
    max-inline-size: 68rem;
    margin-block-start: var(--omarchy-space-xx-large);
  }

  .desktop-proof__intro {
    max-inline-size: var(--omarchy-prose-measure);
  }

  .desktop-proof__media {
    margin: var(--omarchy-space-large) 0 0;
  }

  .desktop-proof__media .media,
  .desktop-proof__media .media__image {
    display: block;
    inline-size: 100%;
  }

  .desktop-proof__caption {
    margin-block-start: var(--omarchy-space-small);
    color: var(--omarchy-terminal-white);
  }
</style>

<section class="desktop-proof" aria-labelledby="desktop-proof-title">
  <div class="desktop-proof__intro">
    <p class="page-hero__eyebrow">Current proof</p>
    <h2 id="desktop-proof-title">The desktop, in use.</h2>
    <p>This Tokyo Night preview is an actual Omarchy desktop from the project’s official repository.</p>
  </div>
  <figure class="desktop-proof__media">
    {% include media.html media=page.media %}
    <figcaption class="desktop-proof__caption">Tokyo Night theme preview from the official Omarchy repository.</figcaption>
  </figure>
</section>
<section class="prose" aria-labelledby="desktop-now-title">
  <p class="page-hero__eyebrow">Current product</p>
  <h2 id="desktop-now-title">A finished starting point beats a blank canvas.</h2>
  <p>Omarchy is an omakase Linux distribution based on Arch, Hyprland, and Quickshell. It starts with a tiling desktop, terminal-first tools, and one coherent visual system instead of a pile of choices.</p>
  <p>The point is not to freeze the computer in place. Strong defaults get you working quickly; the terminal, configuration, and agents leave the system malleable all the way down.</p>
</section>

<section class="prose" aria-labelledby="desktop-workflows-title">
  <h2 id="desktop-workflows-title">Agents work on real seams.</h2>
  <p>Use an agent where it can make a concrete change you can inspect. The controls stay with you.</p>
{% include workflow-list.html items=site.data.home.workflows.items class="home-workflow-list" %}
</section>

<section class="prose" aria-labelledby="desktop-actions-title">
  <h2 id="desktop-actions-title">Start with the real thing.</h2>
  <p>Install the current desktop from the ISO, then keep the Manual close while you make it yours.</p>
{% include desktop-actions.html %}
</section>
