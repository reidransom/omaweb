---
layout: landing
title: Hardware
description: Se fællesskabets nuværende workstations og undersøgende spørgsmål om desktops, laptops og tilbehør.
permalink: /hardware/
lang: da
translation_key: hardware
nav_group: hardware
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Hardware</p>
    <h1>En desktop har brug for et sted at høre hjemme.</h1>
    <p class="home-section__intro">Workstations viser, hvordan folk bruger Omarchy i dag. Desktops, Laptops og Accessories undersøger, hvad en nyttig evaluering af hardware kan indebære. Her loves ingen modeller, specifikationer eller datoer.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="hardware-options-title">
  <div class="home-section__inner">
    <h2 id="hardware-options-title">Se først det eksisterende, dernæst spørgsmålene</h2>
    <ul class="home-card-grid" role="list">
      {% assign products = site.data.products.items | where: "group", "hardware" %}
      {% include product-cards.html products=products description='summary' cta_prefix='Udforsk' %}
    </ul>
  </div>
</section>
