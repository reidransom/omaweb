---
layout: landing
title: Platforms
description: Omarchy starts with the current Desktop; Server and Mobile are exploratory ideas, not release promises.
permalink: /platforms/
nav_group: platforms
archetype: landing
---
<header class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Platforms</p>
    <h1>Start from the desktop. Explore the edges.</h1>
    <p class="home-section__intro">Desktop is Omarchy today: an Arch, Hyprland, and Quickshell system with strong defaults and room to change them. Server and Mobile are questions we are exploring, not availability claims or a release calendar.</p>
  </div>
</header>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="platforms-options-title">
  <div class="home-section__inner">
    <h2 id="platforms-options-title">Choose a surface</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.items | where: "group", "platforms" %}
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
            <span aria-hidden="true">Explore {{ product.label | escape }} →</span>
          </a>
        </li>
      {% endfor %}
    </ul>
  </div>
</section>
