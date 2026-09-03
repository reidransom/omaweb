---
layout: content
title: The Teams
description: The teams guiding Omarchy.
permalink: /teams/
nav_group: project
archetype: project
---
{% assign people = site.data.people %}
<div class="team-directory">

<section id="core" class="prose team-directory__section" aria-labelledby="core-title">
  <h2 id="core-title"><a href="{{ '/teams/core/' | relative_url }}">{{ people.core.label }}</a></h2>
  <p>{{ people.core.remit }}.</p>
  {% include people-grid.html team=people.core %}
</section>

<section id="security" class="prose team-directory__section" aria-labelledby="security-title">
  <h2 id="security-title"><a href="{{ '/security/' | relative_url }}">{{ people.security.label }}</a></h2>
  <p>{{ people.security.remit }}.</p>
  {% include people-grid.html team=people.security %}
</section>

<section id="rangers" class="prose team-directory__section" aria-labelledby="rangers-title">
  <h2 id="rangers-title"><a href="{{ '/teams/rangers/' | relative_url }}">{{ people.rangers.label }}</a></h2>
  <p>{{ people.rangers.remit }}.</p>
  {% include people-grid.html team=people.rangers %}
  <p>Want to help? Apply to <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>
</div>
