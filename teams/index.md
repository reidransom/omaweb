---
layout: content
title: The Teams
description: The teams guiding Omarchy.
permalink: /teams/
nav_group: project
archetype: project
---
{% assign people = site.data.people %}

<section id="core" class="prose" aria-labelledby="core-title">
  <h2 id="core-title">{{ people.core.label }}</h2>
  <p>{{ people.core.remit }}.</p>
  {% include people-grid.html team=people.core %}
  <p><a href="{{ '/teams/core/' | relative_url }}">Meet Omarchy Core</a></p>
</section>

<section id="security" class="prose" aria-labelledby="security-title">
  <h2 id="security-title">{{ people.security.label }}</h2>
  <p>{{ people.security.remit }}.</p>
  {% include people-grid.html team=people.security %}
  <p><a href="{{ '/security/' | relative_url }}">Report a security issue</a></p>
</section>

<section id="rangers" class="prose" aria-labelledby="rangers-title">
  <h2 id="rangers-title">{{ people.rangers.label }}</h2>
  <p>{{ people.rangers.remit }}.</p>
  {% include people-grid.html team=people.rangers %}
  <p>Want to help? Apply to <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
  <p><a href="{{ '/teams/rangers/' | relative_url }}">Meet the Rangers</a></p>
</section>
