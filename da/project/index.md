---
layout: landing
title: Projektet
description: Følg Omarchy gennem det aktuelle fællesskab, nyheder, fondens arbejde og de undersøgende Labs.
permalink: /project/
lang: da
translation_key: project
nav_group: project
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Projektet</p>
    <h1>En desktop bliver bedre, når mennesker gør den bedre.</h1>
    <p class="home-section__intro">Følg arbejdet under Nyheder, find mennesker og steder i Fællesskabet, og se den offentlige støtte bag det gennem Omacom Foundation. Labs er noget andet: et hjem for eksperimenter, ikke en produktannoncering.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="project-paths-title">
  <div class="home-section__inner">
    <h2 id="project-paths-title">Vælg en vej ind i projektet</h2>
    <ul class="home-card-grid" role="list">
      <li class="home-card">
        <a class="home-card__link" href="{{ '/news/' | relative_url }}">
          <h3>Nyheder på engelsk</h3>
          <p>Udgivelser, arrangementer og de mennesker, der udfører arbejdet.</p>
          <span aria-hidden="true">Læs nyhederne →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/community/' | localized_url }}">
          <h3>Fællesskab</h3>
          <p>Meetups, bidragydere, workstations, plugins og de steder, hvor Omarchy-folk mødes.</p>
          <span aria-hidden="true">Find fællesskabet →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/foundation/' | localized_url }}">
          <h3>Omacom Foundation</h3>
          <p>Fondens offentlige arbejde, der støtter projektet.</p>
          <span aria-hidden="true">Mød Omacom Foundation →</span>
        </a>
      </li>
      {% assign labs = site.data.products.items | where: "slug", "labs" %}
      {% include product-cards.html products=labs description='summary' cta_prefix='Udforsk' %}
    </ul>
  </div>
</section>

<section class="home-section home-section--reading" aria-labelledby="project-routes-title">
  <div class="home-section__inner home-section__inner--narrow">
    <h2 id="project-routes-title">Flere veje ind i arbejdet</h2>
    <ul>
      <li><a href="{{ '/teams/' | localized_url }}">Hold</a> — menneskene, der tager sig af projektet.</li>
      <li><a href="{{ '/security/' | localized_url }}">Sikkerhed</a> — ansvarlig offentliggørelse og sikkerhedsvejledning.</li>
      <li><a href="{{ '/air/' | localized_url }}">Artists in Residence</a> — kreativt arbejde med forbindelse til Omarchy.</li>
      <li><a href="{{ '/meetups/' | localized_url }}">Meetups</a> — lokale sammenkomster verden over.</li>
      <li><a href="{{ '/patrons/' | localized_url }}">Patroner</a> og <a href="{{ '/sponsorships/' | localized_url }}">sponsorater</a> — offentlig støtte til Omacom Foundation og dens arbejde.</li>
    </ul>
  </div>
</section>
