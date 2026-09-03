---
layout: content
title: Nouvelles versions
description: Un espace qui pourra un jour présenter de nouvelles versions. Rien n’est annoncé ici.
permalink: /new-releases/
lang: fr
translation_key: new-releases
nav_group: shop
archetype: project
status: exploratory
---
{% assign shop_navigation = site.data.navigation.sections.shop %}
<nav class="prose section-landing-prose" aria-labelledby="shop-contents-title">
  <h2 id="shop-contents-title">Dans cette section</h2>
  <ul>
{% for link_key in shop_navigation.links %}
{% assign link = site.data.navigation.links[link_key] %}
{% capture shop_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ shop_link | strip_newlines | strip }}<span class="section-toc__description"> : {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="new-releases-status-title">
  <h2 id="new-releases-status-title">Rien à annoncer pour l’instant.</h2>
  <p>Cette page pourra un jour présenter de nouvelles versions. Elle ne précise aucun produit, aucune date, aucune disponibilité et ne promet aucune sortie.</p>
</section>
