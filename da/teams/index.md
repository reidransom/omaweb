---
layout: content
title: Holdene
description: Holdene, der sætter retningen for Omarchy.
permalink: /teams/
lang: da
translation_key: teams
nav_group: project
archetype: project
---
{% assign teams = site.data.people.teams %}
<div class="team-directory">

<section id="core" class="prose team-directory__section" aria-labelledby="core-title">
  <h2 id="core-title"><a href="{{ '/teams/core/' | localized_url }}">{{ teams.core.label }}</a></h2>
  <p>{{ teams.core.remit }}.</p>
  {% include people-grid.html team=teams.core %}
</section>

<section id="security" class="prose team-directory__section" aria-labelledby="security-title">
  <h2 id="security-title"><a href="{{ '/security/' | localized_url }}">{{ teams.security.label }}</a></h2>
  <p>{{ teams.security.remit }}.</p>
  {% include people-grid.html team=teams.security %}
</section>

<section id="rangers" class="prose team-directory__section" aria-labelledby="rangers-title">
  <h2 id="rangers-title"><a href="{{ '/teams/rangers/' | localized_url }}">{{ teams.rangers.label }}</a></h2>
  <p>{{ teams.rangers.remit }}.</p>
  {% include people-grid.html team=teams.rangers %}
  <p>Vil du hjælpe? Ansøg på <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>
</div>
