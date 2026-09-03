---
layout: landing
title: Platforms
description: Omarchy er i dag tilgængeligt som et Linux-desktopsystem; Server og Mobile er undersøgende idéer, ikke løfter om udgivelser.
permalink: /platforms/
lang: da
translation_key: platforms
nav_group: platforms
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Platforms</p>
    <h1>Brug Omarchy nu. Udforsk andre platforme senere.</h1>
    <p class="home-section__intro">Omarchy er i dag tilgængeligt som et system med Arch, Hyprland og Quickshell. Server og Mobile er spørgsmål, der undersøges, ikke påstande om tilgængelighed eller en udgivelseskalender.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="platforms-options-title">
  <div class="home-section__inner">
    <h2 id="platforms-options-title">Andre platforme at udforske</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.groups.platforms %}
      {% include product-cards.html products=products description='summary' cta_prefix='Udforsk' %}
    </ul>
  </div>
</section>
