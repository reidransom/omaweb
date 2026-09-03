---
layout: content
title: The Teams
description: The teams guiding Omarchy.
permalink: /teams/
lang: en
translation_key: teams
nav_group: project
archetype: project
---
{% assign teams = site.data.people.teams %}
<div class="team-directory">

<section id="core" class="prose team-directory__section" aria-labelledby="core-title">
  <h2 id="core-title"><a href="{{ '/teams/core/' | relative_url }}">{{ teams.core.label }}</a></h2>
  <p>{{ teams.core.remit }}.</p>
  {% include people-grid.html team=teams.core %}
</section>

<section id="security" class="prose team-directory__section" aria-labelledby="security-title">
  <h2 id="security-title"><a href="{{ '/security/' | relative_url }}">{{ teams.security.label }}</a></h2>
  <p>{{ teams.security.remit }}.</p>
  {% include people-grid.html team=teams.security %}
</section>

<section id="rangers" class="prose team-directory__section" aria-labelledby="rangers-title">
  <h2 id="rangers-title"><a href="{{ '/teams/rangers/' | relative_url }}">{{ teams.rangers.label }}</a></h2>
  <p>{{ teams.rangers.remit }}.</p>
  {% include people-grid.html team=teams.rangers %}
  <p>Want to help? Apply to <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>
</div>
