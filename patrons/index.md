---
layout: default
title: Patrons
description: The current patrons supporting the Omacom Foundation's mission.
permalink: /patrons/
lang: en
translation_key: patrons
nav_group: project
archetype: project
---
{% assign patron_tiers = site.data.patrons.tiers.items %}

<article class="patrons-page">
<header class="patrons-page__header">
<h1>The Omacom Foundation</h1>
</header>

<div class="patron-tiers">
{% for tier in patron_tiers %}
<section class="patron-tier" aria-labelledby="patron-tier-{{ tier.slug }}">
<header class="patron-tier__header">
<h2 id="patron-tier-{{ tier.slug }}">{{ tier.label }}</h2>
<p>{{ tier.description }}</p>
</header>

{% if tier.people.items.size > 0 %}
<ul class="patron-list" aria-label="{{ tier.label | escape }}">
{% for patron in tier.people.items %}
<li class="patron-card">
{% if patron.image %}
<img class="patron-card__image" src="{{ patron.image | relative_url }}" alt="{{ patron.name | escape }}" width="240" height="240" loading="lazy" decoding="async">
{% endif %}
<h3><a href="{{ patron.profile | escape }}" rel="noreferrer">{{ patron.name | escape }}</a></h3>
<p class="patron-card__organization"><a href="{{ patron.organization_url | escape }}" rel="noreferrer">{{ patron.organization | escape }}</a></p>
</li>
{% endfor %}
</ul>
{% endif %}

{% if tier.contact_url %}
<p class="patron-tier__note"><a href="{{ tier.contact_url | escape }}">{{ tier.contact_label | escape }}: {{ tier.contact | escape }}</a>.</p>
{% endif %}
</section>
{% endfor %}
</div>
</article>
