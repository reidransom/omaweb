---
layout: content
title: Omacom Foundation
description: Den almennyttige organisation, der ejer Omarchys varemærker, finansierer infrastrukturen og støtter de mennesker og projekter, som distributionen bygger på.
permalink: /foundation/
lang: da
translation_key: foundation
nav_group: project
archetype: project
---
{% assign foundation_navigation = site.data.navigation.sections | where: 'url', '/foundation/' | first %}
<nav class="prose section-landing-prose" aria-labelledby="foundation-contents-title">
  <h2 id="foundation-contents-title">I dette afsnit</h2>
  <ul>
{% for link in foundation_navigation.links.items %}
{% capture foundation_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ foundation_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="foundation-role-title">
  <h2 id="foundation-role-title">Hold arbejdet ved lige</h2>
  <p>Omacom Foundation er den almennyttige organisation bag Omarchy. Den ejer varemærkerne, finansierer infrastrukturen, udbreder arbejdet og støtter de open source-projekter og udviklere, som distributionen afhænger af.</p>
</section>

