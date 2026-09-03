---
layout: content
title: Omacom Foundation
description: The nonprofit that holds Omarchy trademarks, funds infrastructure, and supports the people and projects the distribution relies on.
permalink: /foundation/
lang: en
translation_key: foundation
nav_group: project
archetype: project
---
{% assign foundation_navigation = site.data.navigation.sections | where: 'url', '/foundation/' | first %}
<nav class="prose section-landing-prose" aria-labelledby="foundation-contents-title">
  <h2 id="foundation-contents-title">In this section</h2>
  <ul>
{% for link in foundation_navigation.links.items %}
{% capture foundation_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ foundation_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="foundation-role-title">
  <h2 id="foundation-role-title">Keep the work maintained</h2>
  <p>The Omacom Foundation is the nonprofit behind Omarchy. It holds the trademarks, funds the infrastructure, promotes the work, and supports the open-source projects and developers the distribution depends on.</p>
</section>

