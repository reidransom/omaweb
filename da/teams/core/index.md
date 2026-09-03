---
layout: content
title: Omarchy Core
description: Menneskene, der sætter retningen for Omarchy.
permalink: /teams/core/
lang: da
translation_key: core-team
nav_group: project
archetype: project
---
{% assign team = site.data.people.teams.core %}

<section class="prose" aria-labelledby="core-remit-title">
  <h2 id="core-remit-title">{{ team.remit }}</h2>
  {% include people-grid.html team=team %}
</section>

<section class="prose" aria-labelledby="core-directory-title">
  <h2 id="core-directory-title">Hele holdoversigten</h2>
  <p><a href="{{ '/teams/' | localized_url }}#core">Se Omarchy Core sammen med Security og Rangers.</a></p>
</section>
