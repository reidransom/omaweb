---
layout: landing
title: Software
description: Explore Omarchy's current community Plugins alongside exploratory Apps and Cloud ideas.
permalink: /software/
nav_group: software
archetype: landing
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Software</p>
    <h1>Keep the system opinionated. Keep it yours.</h1>
    <p class="home-section__intro">Plugins are current community additions, with their own authoritative directory. Apps and Cloud name two areas of exploration: first-party application principles on one side, and questions about a hosted workstation on the other. Neither is a catalog, service offer, or roadmap.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="software-options-title">
  <div class="home-section__inner">
    <h2 id="software-options-title">Extend what exists. Question what comes next.</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.items | where: "group", "software" %}
      {% for product in products %}
        {% assign card_url = product.url %}
        {% assign card_external = product.external %}
        {% if product.external %}
          {% for navigation_group in site.data.navigation.groups.items %}
            {% for navigation_link in navigation_group.links.items %}
              {% if navigation_link.label == product.label %}
                {% assign card_url = navigation_link.url %}
                {% assign card_external = navigation_link.external %}
              {% endif %}
            {% endfor %}
          {% endfor %}
        {% endif %}
        <li class="home-card">
          <a class="home-card__link" href="{% if card_external %}{{ card_url }}{% else %}{{ card_url | relative_url }}{% endif %}"{% if card_external %} rel="noreferrer"{% endif %}>
            {% include status-label.html status=product.status %}
            <h3>{{ product.label | escape }}</h3>
            <p>{{ product.summary | escape }}</p>
            <span aria-hidden="true">{% if product.external %}Visit{% else %}Explore{% endif %} {{ product.label | escape }} →</span>
          </a>
        </li>
      {% endfor %}
    </ul>
  </div>
</section>
