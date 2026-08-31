---
layout: content
title: Patrons
description: The current patrons supporting the Omacom Foundation's mission.
permalink: /patrons/
nav_group: project
archetype: project
---
{% assign patron_tiers = site.data.patrons.tiers.items %}

<section class="prose" aria-labelledby="patrons-intro-title">
  <h2 id="patrons-intro-title">Funding with names attached</h2>
  <p>The Omacom Foundation is funded by patrons. The current structure recognizes Founding Patrons and Distinguished Patrons, with their contribution levels stated plainly below.</p>
</section>

{% for tier in patron_tiers %}
<section class="prose" aria-labelledby="patron-tier-{{ tier.slug }}">
  <h2 id="patron-tier-{{ tier.slug }}">{{ tier.label }}</h2>
  <p><strong>{{ tier.contribution }}</strong> {{ tier.description }}</p>
  {% if tier.people.items.size > 0 %}
  <ul>
    {% for patron in tier.people.items %}
    <li><a href="{{ patron.profile }}" rel="noreferrer">{{ patron.name }}</a> — <a href="{{ patron.organization_url }}" rel="noreferrer">{{ patron.organization }}</a></li>
    {% endfor %}
  </ul>
  {% endif %}
  {% if tier.contact_url %}
  <p><a href="{{ tier.contact_url }}">{{ tier.contact_label }}: {{ tier.contact }}</a>.</p>
  {% endif %}
</section>
{% endfor %}
