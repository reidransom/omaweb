---
layout: product
title: Desktop
description: Omarchy is a current Arch, Hyprland, and Quickshell desktop with terminal-first workflows and room to make the system your own.
permalink: /desktop/
nav_group: platforms
archetype: product
---
<section class="prose" aria-labelledby="desktop-now-title">
  <p class="page-hero__eyebrow">Current product</p>
  <h2 id="desktop-now-title">A finished starting point beats a blank canvas.</h2>
  <p>Omarchy is an omakase Linux distribution based on Arch, Hyprland, and Quickshell. It starts with a tiling desktop, terminal-first tools, and one coherent visual system instead of a pile of choices.</p>
  <p>The point is not to freeze the computer in place. Strong defaults get you working quickly; the terminal, configuration, and agents leave the system malleable all the way down.</p>
</section>

<section class="prose" aria-labelledby="desktop-workflows-title">
  <h2 id="desktop-workflows-title">Agents work on real seams.</h2>
  <p>Use an agent where it can make a concrete change you can inspect. The controls stay with you.</p>
  <ol class="home-workflow-list">
    {% for workflow in site.data.home.workflows.items %}
      <li>
        <h3>{{ workflow.title | escape }}</h3>
        <p>{{ workflow.body | escape }}</p>
      </li>
    {% endfor %}
  </ol>
</section>

<section class="prose" aria-labelledby="desktop-actions-title">
  <h2 id="desktop-actions-title">Start with the real thing.</h2>
  <p>Install the current desktop from the ISO, then keep the Manual close while you make it yours.</p>
  <div class="button-group" aria-label="Desktop actions">
    {% assign desktop_action_labels = "ISO,Manual" | split: "," %}
    {% for action_label in desktop_action_labels %}
      {% for navigation_link in site.data.navigation.utility.items %}
        {% if navigation_link.label == action_label %}
          <a class="button{% unless action_label == 'ISO' %} button--secondary{% endunless %}" href="{{ navigation_link.url }}" rel="noreferrer">{% if action_label == 'ISO' %}Get The ISO{% else %}Read The Manual{% endif %}</a>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </div>
</section>
