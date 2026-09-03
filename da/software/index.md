---
layout: landing
title: Software
description: Udforsk Omarchys nuværende Plugins fra fællesskabet sammen med undersøgende idéer til Apps og Cloud.
permalink: /software/
lang: da
translation_key: software
nav_group: software
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Software</p>
    <h1>Hold systemet holdningsstærkt. Lad det forblive dit.</h1>
    <p class="home-section__intro">Plugins er aktuelle tilføjelser fra fællesskabet med deres eget autoritative katalog. Apps og Cloud er navnene på to områder, der undersøges: principper for førstepartsapplikationer på den ene side og spørgsmål om en hostet workstation på den anden. Ingen af delene er et katalog, et servicetilbud eller en køreplan.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="software-options-title">
  <div class="home-section__inner">
    <h2 id="software-options-title">Udvid det eksisterende. Sæt spørgsmålstegn ved det næste.</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.items | where: "group", "software" %}
      {% include product-cards.html products=products description='summary' cta_prefix='Udforsk' destination_cta_prefix='Besøg' %}
    </ul>
  </div>
</section>
