---
layout: landing
title: Hardware
description: See current community workstations and the exploratory questions guiding Omarchy laptops.
permalink: /hardware/
nav_group: hardware
archetype: landing
---
<header class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Hardware</p>
    <h1>The desktop needs a place to live.</h1>
    <p class="home-section__intro">Workstations already show the desktop in the hands of its community. Laptops are an exploration into what useful certification, repairability, tested hardware, and availability could mean. No models, specifications, or dates are being promised here.</p>
  </div>
</header>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="hardware-options-title">
  <div class="home-section__inner">
    <h2 id="hardware-options-title">See what is here, then what is being considered</h2>
    <ul class="home-card-grid" role="list">
      {% assign products = site.data.products.items | where: "group", "hardware" %}
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
