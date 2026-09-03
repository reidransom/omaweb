---
layout: content
title: Omarchy Rangers
description: Les personnes qui aident les autres à trouver leur chemin dans Omarchy.
permalink: /teams/rangers/
lang: fr
translation_key: rangers-team
nav_group: project
archetype: project
---
{% assign team = site.data.people.teams.rangers %}

<section class="prose" aria-labelledby="rangers-remit-title">
  <h2 id="rangers-remit-title">{{ team.remit }}</h2>
  {% include people-grid.html team=team %}
</section>

<section class="prose" aria-labelledby="rangers-apply-title">
  <h2 id="rangers-apply-title">Aidez à prendre soin de la communauté</h2>
  <p>Vous voulez aider ? Candidatez à <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>

<section class="prose" aria-labelledby="rangers-directory-title">
  <h2 id="rangers-directory-title">L’annuaire complet des équipes</h2>
  <p><a href="{{ '/teams/' | localized_url }}#rangers">Voir les Rangers aux côtés de Core et Security.</a></p>
</section>
