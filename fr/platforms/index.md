---
layout: landing
title: Plateformes
description: Omarchy existe aujourd’hui comme système Linux de bureau ; Server et Mobile sont des pistes d’exploration, pas des promesses de sortie.
permalink: /platforms/
lang: fr
translation_key: platforms
nav_group: platforms
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Plateformes</p>
    <h1>Utilisez Omarchy maintenant. Explorez d’autres plateformes ensuite.</h1>
    <p class="home-section__intro">Omarchy est aujourd’hui disponible comme système basé sur Arch, Hyprland et Quickshell. Server et Mobile sont des questions à explorer, pas des affirmations de disponibilité ni un calendrier de sorties.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="platforms-options-title">
  <div class="home-section__inner">
    <h2 id="platforms-options-title">D’autres plateformes à explorer</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.groups.platforms %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explorer' %}
    </ul>
  </div>
</section>
