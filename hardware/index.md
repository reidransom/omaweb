---
layout: landing
title: Hardware
description: See current community workstations and the exploratory questions guiding Omarchy laptops.
permalink: /hardware/
nav_group: hardware
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Hardware</p>
    <h1>The desktop needs a place to live.</h1>
    <p class="home-section__intro">Workstations already show the desktop in the hands of its community. Laptops are an exploration into what useful certification, repairability, tested hardware, and availability could mean. No models, specifications, or dates are being promised here.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="hardware-options-title">
  <div class="home-section__inner">
    <h2 id="hardware-options-title">See what is here, then what is being considered</h2>
    <ul class="home-card-grid" role="list">
      {% assign products = site.data.products.items | where: "group", "hardware" %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explore' %}
    </ul>
  </div>
</section>
