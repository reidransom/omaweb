---
layout: content
title: Parrainages
description: Le soutien actuel d’Omacom Foundation à Hyprland, Quickshell et mise.
permalink: /sponsorships/
lang: fr
translation_key: sponsorships
nav_group: project
archetype: project
---
{% assign sponsorship_order = site.data.sponsorships.order %}
{% assign sponsorships = site.data.sponsorships.items %}

<section class="prose" aria-labelledby="sponsorships-intro-title">
  <h2 id="sponsorships-intro-title">Soutenir ce sur quoi Omarchy repose</h2>
  <p>Omacom Foundation parraine les projets open source dont dépend Omarchy. Chaque entrée indique le projet, son mainteneur, le niveau de parrainage et l’annonce publique.</p>
</section>

{% for sponsorship_key in sponsorship_order %}
{% assign sponsorship = sponsorships[sponsorship_key] %}
<section class="prose" aria-labelledby="sponsorship-{{ sponsorship_key }}">
  <h2 id="sponsorship-{{ sponsorship_key }}"><a href="{{ sponsorship.url }}" rel="noreferrer">{{ sponsorship.label }}</a></h2>
  <p><strong>Niveau de parrainage : {{ sponsorship.level }}.</strong> {{ sponsorship.summary }}</p>
  {% if sponsorship.term %}<p>{{ sponsorship.term }}{% if sponsorship.starts_at %} Début le {{ sponsorship.starts_at | date: "%d/%m/%Y" }}.{% endif %}</p>{% endif %}
  <p>Maintenu par <a href="{{ sponsorship.maintainer_url }}" rel="noreferrer">{{ sponsorship.maintainer }}</a>. <a href="{{ sponsorship.announcement_url | relative_url }}">Lire l’annonce en anglais</a>.</p>
</section>
{% endfor %}
