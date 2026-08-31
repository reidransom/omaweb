---
layout: landing
title: Platforms
description: Omarchy starts with the current Desktop; Server and Mobile are exploratory ideas, not release promises.
permalink: /platforms/
nav_group: platforms
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">Platforms</p>
    <h1>Start from the desktop. Explore the edges.</h1>
    <p class="home-section__intro">Desktop is Omarchy today: an Arch, Hyprland, and Quickshell system with strong defaults and room to change them. Server and Mobile are questions we are exploring, not availability claims or a release calendar.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="platforms-options-title">
  <div class="home-section__inner">
    <h2 id="platforms-options-title">Choose a surface</h2>
    <ul class="home-card-grid home-card-grid--three" role="list">
      {% assign products = site.data.products.items | where: "group", "platforms" %}
      {% for product in products %}
        {% assign destination = site.data.destinations.items | where: 'slug', product.destination | first %}
        <li class="home-card">
          <a class="home-card__link" href="{% if destination %}{{ destination.url | escape }}{% else %}{{ product.url | relative_url }}{% endif %}"{% if destination %} rel="noreferrer"{% endif %}>
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
