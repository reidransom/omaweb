---
layout: content
title: Les équipes
description: Les équipes qui définissent la direction d’Omarchy.
permalink: /teams/
lang: fr
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
  <p><a href="{{ '/teams/core/' | localized_url }}">Découvrir Omarchy Core</a></p>
</section>

<section id="security" class="prose team-directory__section" aria-labelledby="security-title">
  <h2 id="security-title">{{ teams.security.label }}</h2>
  <p>{{ teams.security.remit }}.</p>
  {% include people-grid.html team=teams.security %}
  <p><a href="{{ '/security/' | localized_url }}">Signaler un problème de sécurité</a></p>
</section>

<section id="rangers" class="prose team-directory__section" aria-labelledby="rangers-title">
  <h2 id="rangers-title">{{ teams.rangers.label }}</h2>
  <p>{{ teams.rangers.remit }}.</p>
  {% include people-grid.html team=teams.rangers %}
  <p>Vous voulez aider ? Candidatez à <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
  <p><a href="{{ '/teams/rangers/' | localized_url }}">Découvrir les Rangers</a></p>
</section>
</div>
