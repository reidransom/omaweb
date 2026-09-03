---
layout: landing
title: Software
description: Explore Omarchy's current community Plugins alongside exploratory Apps and Cloud ideas.
permalink: /software/
lang: en
translation_key: software
nav_group: software
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Software</p>
    <h1>Keep the system opinionated. Keep it yours.</h1>
    <p class="home-section__intro">Plugins are current community additions, with their own authoritative directory. Apps and Cloud name two areas of exploration: first-party application principles on one side, and questions about a hosted workstation on the other. Neither is a catalog, service offer, or roadmap.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="software-options-title">
  <div class="home-section__inner">
    <h2 id="software-options-title">Extend what exists. Question what comes next.</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.groups.software %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explore' destination_cta_prefix='Visit' %}
    </ul>
  </div>
</section>
