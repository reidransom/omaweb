---
layout: content
title: Omarchy Rangers
description: The people helping others find their way in Omarchy.
permalink: /teams/rangers/
lang: en
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
  <h2 id="rangers-apply-title">Help care for the community</h2>
  <p>Want to help? Apply to <a href="mailto:rangers@omarchy.org">rangers@omarchy.org</a>.</p>
</section>

<section class="prose" aria-labelledby="rangers-directory-title">
  <h2 id="rangers-directory-title">The full team directory</h2>
  <p><a href="{{ '/teams/' | relative_url }}#rangers">See the Rangers alongside Core and Security.</a></p>
</section>
