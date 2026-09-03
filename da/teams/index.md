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
  <h2 id="core-title">{{ teams.core.label }}</h2>
  <p>{{ teams.core.remit }}.</p>
  {% include people-grid.html team=teams.core %}
  <p><a href="{{ '/teams/core/' | localized_url }}">Mød Omarchy Core</a></p>
</section>

<section id="security" class="prose team-directory__section" aria-labelledby="security-title">
  <h2 id="security-title">{{ teams.security.label }}</h2>
  <p>{{ teams.security.remit }}.</p>
  {% include people-grid.html team=teams.security %}
  <p><a href="{{ '/security/' | localized_url }}">Rapportér et sikkerhedsproblem</a></p>
</section>

<section id="rangers" class="prose team-directory__section" aria-labelledby="rangers-title">
  <h2 id="rangers-title">{{ teams.rangers.label }}</h2>
  <p>{{ teams.rangers.remit }}.</p>
  {% include people-grid.html team=teams.rangers %}
  <p>Vil du hjælpe? Ansøg på <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
  <p><a href="{{ '/teams/rangers/' | localized_url }}">Mød Rangers</a></p>
</section>
</div>
