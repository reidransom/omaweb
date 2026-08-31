---
layout: content
title: Community
description: Find Omarchy people, meetups, workstations, Rangers, plugins, news, and ways to contribute.
permalink: /community/
nav_group: project
archetype: project
---
{% assign discord = site.data.destinations.items | where: "slug", "discord" | first %}
{% assign code = site.data.destinations.items | where: "slug", "code" | first %}
{% assign plugins = site.data.destinations.items | where: "slug", "plugins" | first %}

<section class="prose" aria-labelledby="community-start-title">
  <h2 id="community-start-title">The system is personal. The work around it doesn't have to be.</h2>
  <p>Omarchy gets more useful when people compare setups, trade fixes, write plugins, and meet in the same room. Start with the conversation, then follow the thread that fits what you want to do.</p>
  {% if discord %}
  <p class="button-group">{% include authoritative-link.html destination='discord' label='Join the Discord' class='button' %}</p>
  {% endif %}
</section>

<section class="prose" aria-labelledby="community-places-title">
  <h2 id="community-places-title">Find your people and your next idea</h2>
  <ul>
    <li><a href="{{ '/meetups/' | relative_url }}">Meetups</a> collect local gatherings and practical guidance for bringing people together.</li>
    <li><a href="{{ '/workstations/' | relative_url }}">Workstations</a> is where community desks and their stories belong. The gallery only publishes cleared submissions.</li>
    <li><a href="{{ '/teams/rangers/' | relative_url }}">Rangers</a> is the route to the people helping care for the community.</li>
    {% if plugins %}<li>{% include authoritative-link.html destination='plugins' label='Plugins' %} is the authoritative catalog for extensions made around Omarchy.</li>{% endif %}
    <li><a href="{{ '/news/' | relative_url }}">News</a> follows releases, events, and the project work worth knowing about.</li>
  </ul>
</section>

<section class="prose" aria-labelledby="community-contribute-title">
  <h2 id="community-contribute-title">Bring a useful thing</h2>
  <p>A good contribution can be a patch, a plugin, a careful answer, a meetup, or a workstation photo another person can learn from. Start where the work is visible, and use the route that matches it.</p>
  <ul>
    {% if code %}<li>For code, start at {% include authoritative-link.html destination='code' label='the Omarchy repository' %}.</li>{% endif %}
    {% if plugins %}<li>For an extension, publish it through {% include authoritative-link.html destination='plugins' label='Plugins' %}.</li>{% endif %}
    <li>For community stewardship, visit the <a href="{{ '/teams/rangers/' | relative_url }}">Rangers</a>.</li>
    {% if discord %}<li>For a question, an idea, or a photo you want considered for the gallery, bring it to {% include authoritative-link.html destination='discord' label='Discord' %}.</li>{% endif %}
  </ul>
</section>
