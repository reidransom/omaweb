---
layout: content
title: New Releases
description: A place that may later highlight releases. There is nothing to announce here.
permalink: /new-releases/
nav_group: shop
archetype: project
status: exploratory
---
{% assign shop_navigation = site.data.navigation.sections | where: 'url', '/new-releases/' | first %}
<nav class="prose section-landing-prose" aria-labelledby="shop-contents-title">
  <h2 id="shop-contents-title">In this section</h2>
  <ul>
{% for link in shop_navigation.links.items %}
{% capture shop_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ shop_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="new-releases-status-title">
  <h2 id="new-releases-status-title">Nothing to announce yet.</h2>
  <p>This route may later highlight releases. It does not list products, dates, availability, or a release commitment.</p>
</section>
