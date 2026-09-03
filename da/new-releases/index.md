---
layout: content
title: Nye udgivelser
description: Et sted, der senere kan fremhæve udgivelser. Der er intet at annoncere her.
permalink: /new-releases/
lang: da
translation_key: new-releases
nav_group: shop
archetype: project
status: exploratory
---
{% assign shop_navigation = site.data.navigation.sections | where: 'url', '/new-releases/' | first %}
<nav class="prose section-landing-prose" aria-labelledby="shop-contents-title">
  <h2 id="shop-contents-title">I dette afsnit</h2>
  <ul>
{% for link in shop_navigation.links.items %}
{% capture shop_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ shop_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="new-releases-status-title">
  <h2 id="new-releases-status-title">Intet at annoncere endnu.</h2>
  <p>Denne side kan senere fremhæve udgivelser. Den angiver ingen produkter, datoer, tilgængelighed eller løfter om en udgivelse.</p>
</section>
