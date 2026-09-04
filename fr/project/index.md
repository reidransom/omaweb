---
layout: landing
title: Le projet
description: Suivez Omarchy à travers sa communauté actuelle, ses actualités, le travail de la fondation et les explorations de Labs.
permalink: /project/
lang: fr
translation_key: project
nav_group: project
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Le projet</p>
    <h1>Un bureau s’améliore lorsque les gens l’améliorent.</h1>
    <p class="home-section__intro">Suivez le travail dans les Actualités, trouvez les personnes et les lieux de la Communauté, puis découvrez le soutien public qui le rend possible avec Omacom Foundation. Labs est autre chose : un foyer pour les expériences, pas une annonce produit.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="project-paths-title">
  <div class="home-section__inner">
    <h2 id="project-paths-title">Choisissez une porte d’entrée dans le projet</h2>
    <ul class="home-card-grid" role="list">
      <li class="home-card">
        <a class="home-card__link" href="{{ '/news/' | localized_url }}">
          <h3>Actualités</h3>
          <p>Les versions, les événements et les personnes qui font le travail.</p>
          <span aria-hidden="true">Lire les actualités →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/community/' | localized_url }}">
          <h3>Communauté</h3>
          <p>Rencontres, contributeurs, postes de travail, Plugins et lieux où les Omarchs se retrouvent.</p>
          <span aria-hidden="true">Trouver la communauté →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/foundation/' | localized_url }}">
          <h3>Omacom Foundation</h3>
          <p>Le travail public de la fondation en soutien au projet.</p>
          <span aria-hidden="true">Découvrir Omacom Foundation →</span>
        </a>
      </li>
      {% assign labs = site.data.products.groups.project %}
      {% include product-cards.html products=labs description='summary' cta_prefix='Explorer' %}
    </ul>
  </div>
</section>

<section class="home-section home-section--reading" aria-labelledby="project-routes-title">
  <div class="home-section__inner home-section__inner--narrow">
    <h2 id="project-routes-title">D’autres chemins vers le travail</h2>
    <ul>
      <li><a href="{{ '/teams/' | localized_url }}">Équipes</a> — les personnes qui veillent sur le projet.</li>
      <li><a href="{{ '/security/' | localized_url }}">Sécurité</a> — divulgation responsable et conseils de sécurité.</li>
      <li><a href="{{ '/air/' | localized_url }}">Artists in Residence</a> — un travail créatif lié à Omarchy.</li>
      <li><a href="{{ '/meetups/' | localized_url }}">Rencontres</a> — des rassemblements locaux dans le monde entier.</li>
      <li><a href="{{ '/patrons/' | localized_url }}">Mécènes</a> et <a href="{{ '/sponsorships/' | localized_url }}">parrainages</a> — le soutien public à Omacom Foundation et à son travail.</li>
    </ul>
  </div>
</section>
