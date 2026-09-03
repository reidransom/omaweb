---
layout: landing
title: Platforms
description: Omarchy is available today as a Linux desktop system; Server and Mobile are exploratory ideas, not release promises.
permalink: /platforms/
lang: en
translation_key: platforms
nav_group: platforms
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Platforms</p>
    <h1>Use Omarchy now. Explore other surfaces later.</h1>
    <p class="home-section__intro">Omarchy is available today as an Arch, Hyprland, and Quickshell system. Server and Mobile are questions being explored, not availability claims or a release calendar.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="platforms-options-title">
  <div class="home-section__inner">
    <h2 id="platforms-options-title">Other surfaces to explore</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.groups.platforms %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explore' %}
    </ul>
  </div>
</section>
