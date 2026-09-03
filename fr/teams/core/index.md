---
layout: content
title: Omarchy Core
description: Les personnes qui définissent la direction d’Omarchy.
permalink: /teams/core/
lang: fr
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
  <h2 id="core-directory-title">L’annuaire complet des équipes</h2>
  <p><a href="{{ '/teams/' | localized_url }}#core">Voir Omarchy Core aux côtés de Security et des Rangers.</a></p>
</section>
