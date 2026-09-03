---
layout: content
title: Omarchy Rangers
description: Menneskene, der hjælper andre med at finde vej i Omarchy.
permalink: /teams/rangers/
lang: da
translation_key: rangers-team
nav_group: project
archetype: project
---
{% assign team = site.data.people.rangers %}

<section class="prose" aria-labelledby="rangers-remit-title">
  <h2 id="rangers-remit-title">{{ team.remit }}</h2>
  {% include people-grid.html team=team %}
</section>

<section class="prose" aria-labelledby="rangers-apply-title">
  <h2 id="rangers-apply-title">Hjælp med at passe på fællesskabet</h2>
  <p>Vil du hjælpe? Ansøg på <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>

<section class="prose" aria-labelledby="rangers-directory-title">
  <h2 id="rangers-directory-title">Hele holdoversigten</h2>
  <p><a href="{{ '/teams/' | localized_url }}#rangers">Se Rangers sammen med Core og Security.</a></p>
</section>
