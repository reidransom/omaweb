---
layout: content
title: Sponsorater
description: Omacom Foundations nuværende støtte til Hyprland, Quickshell og mise.
permalink: /sponsorships/
lang: da
translation_key: sponsorships
nav_group: project
archetype: project
---
{% assign sponsorship_order = site.data.sponsorships.order %}
{% assign sponsorships = site.data.sponsorships.items %}

<section class="prose" aria-labelledby="sponsorships-intro-title">
  <h2 id="sponsorships-intro-title">Støt det, Omarchy bygger på</h2>
  <p>Omacom Foundation sponsorerer de open source-projekter, som Omarchy afhænger af. Hver post angiver projektet, dets vedligeholder, sponsorniveauet og den offentlige meddelelse.</p>
</section>

{% for sponsorship_key in sponsorship_order %}
{% assign sponsorship = sponsorships[sponsorship_key] %}
<section class="prose" aria-labelledby="sponsorship-{{ sponsorship_key }}">
  <h2 id="sponsorship-{{ sponsorship_key }}"><a href="{{ sponsorship.url }}" rel="noreferrer">{{ sponsorship.label }}</a></h2>
  <p><strong>Sponsorniveau: {{ sponsorship.level }}.</strong> {{ sponsorship.summary }}</p>
  {% if sponsorship.term %}<p>{{ sponsorship.term }}{% if sponsorship.starts_at %} Starter {{ sponsorship.starts_at | date: "%d.%m.%Y" }}.{% endif %}</p>{% endif %}
  <p>Vedligeholdes af <a href="{{ sponsorship.maintainer_url }}" rel="noreferrer">{{ sponsorship.maintainer }}</a>. <a href="{{ sponsorship.announcement_url | relative_url }}">Læs meddelelsen på engelsk</a>.</p>
</section>
{% endfor %}
