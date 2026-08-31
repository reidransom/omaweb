---
layout: content
title: Omarchy Core
description: The people setting the direction for Omarchy.
permalink: /teams/core/
nav_group: project
archetype: project
---
{% assign team = site.data.people.core %}

<section class="prose" aria-labelledby="core-remit-title">
  <h2 id="core-remit-title">{{ team.remit }}</h2>
  {% include people-grid.html team=team %}
</section>

<section class="prose" aria-labelledby="core-directory-title">
  <h2 id="core-directory-title">The full team directory</h2>
  <p><a href="{{ '/teams/' | relative_url }}#core">See Omarchy Core alongside Security and Rangers.</a></p>
</section>
