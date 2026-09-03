---
layout: content
title: Omacom Foundation
description: L’organisation à but non lucratif qui détient les marques Omarchy, finance l’infrastructure et soutient les personnes et les projets dont dépend la distribution.
permalink: /foundation/
lang: fr
translation_key: foundation
nav_group: project
archetype: project
---
{% assign foundation_navigation = site.data.navigation.sections.foundation %}
<nav class="prose section-landing-prose" aria-labelledby="foundation-contents-title">
  <h2 id="foundation-contents-title">Dans cette section</h2>
  <ul>
{% for link_key in foundation_navigation.links %}
{% assign link = site.data.navigation.links[link_key] %}
{% capture foundation_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ foundation_link | strip_newlines | strip }}<span class="section-toc__description"> : {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="foundation-role-title">
  <h2 id="foundation-role-title">Faire durer le travail</h2>
  <p>Omacom Foundation est l’organisation à but non lucratif derrière Omarchy. Elle détient les marques, finance l’infrastructure, fait connaître le travail et soutient les projets open source et les développeurs dont dépend la distribution.</p>
</section>
