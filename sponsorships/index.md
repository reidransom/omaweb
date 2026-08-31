---
layout: content
title: Sponsorships
description: Current Omacom Foundation support for Hyprland, Quickshell, and mise.
permalink: /sponsorships/
nav_group: project
archetype: project
---
{% assign sponsorships = site.data.sponsorships.items %}

<section class="prose" aria-labelledby="sponsorships-intro-title">
  <h2 id="sponsorships-intro-title">Support the parts Omarchy stands on</h2>
  <p>The Omacom Foundation sponsors the open-source projects Omarchy depends on. Each entry names the project, its maintainer, the sponsorship level, and the public announcement.</p>
</section>

{% for sponsorship in sponsorships %}
<section class="prose" aria-labelledby="sponsorship-{{ sponsorship.slug }}">
  <h2 id="sponsorship-{{ sponsorship.slug }}"><a href="{{ sponsorship.url }}" rel="noreferrer">{{ sponsorship.label }}</a></h2>
  <p><strong>{{ sponsorship.level }} sponsorship.</strong> {{ sponsorship.summary }}</p>
  {% if sponsorship.term %}<p>{{ sponsorship.term }}{% if sponsorship.starts_at %} Starts {{ sponsorship.starts_at | date: "%B %-d, %Y" }}.{% endif %}</p>{% endif %}
  <p>Maintained by <a href="{{ sponsorship.maintainer_url }}" rel="noreferrer">{{ sponsorship.maintainer }}</a>. <a href="{{ sponsorship.announcement_url | relative_url }}">Read the announcement</a>.</p>
</section>
{% endfor %}
