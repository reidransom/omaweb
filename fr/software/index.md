---
layout: landing
title: Logiciels
description: Découvrez les Plugins actuels de la communauté Omarchy et les pistes exploratoires pour Apps et Cloud.
permalink: /software/
lang: fr
translation_key: software
nav_group: software
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Logiciels</p>
    <h1>Gardez un système assumé. Laissez-le rester le vôtre.</h1>
    <p class="home-section__intro">Les Plugins sont des extensions actuelles de la communauté, réunies dans leur propre catalogue officiel. Apps et Cloud nomment deux terrains d’exploration : les principes d’applications développées par Omarchy d’un côté, les questions soulevées par un poste de travail hébergé de l’autre. Aucun des deux n’est un catalogue, une offre de service ou une feuille de route.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="software-options-title">
  <div class="home-section__inner">
    <h2 id="software-options-title">Étendez ce qui existe. Interrogez ce qui vient ensuite.</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.groups.software %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explorer' destination_cta_prefix='Visiter' %}
    </ul>
  </div>
</section>
