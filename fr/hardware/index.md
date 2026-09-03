---
layout: landing
title: Matériel
description: Découvrez les postes de travail actuels de la communauté et les questions exploratoires sur les ordinateurs de bureau, les portables et les accessoires.
permalink: /hardware/
lang: fr
translation_key: hardware
nav_group: hardware
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Matériel</p>
    <h1>Un ordinateur de bureau a besoin d’un endroit où vivre.</h1>
    <p class="home-section__intro">Workstations montre comment les gens utilisent Omarchy aujourd’hui. Ordinateurs de bureau, Portables et Accessoires explorent ce qu’une évaluation utile du matériel pourrait exiger. Aucun modèle, aucune spécification et aucune date ne sont promis ici.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="hardware-options-title">
  <div class="home-section__inner">
    <h2 id="hardware-options-title">D’abord ce qui existe. Ensuite, les questions.</h2>
    <ul class="home-card-grid" role="list">
      {% assign products = site.data.products.groups.hardware %}
      {% include product-cards.html products=products description='summary' cta_prefix='Explorer' %}
    </ul>
  </div>
</section>
