---
layout: project
title: Community
description: Find Omarchy people, meetups, workstations, Rangers, plugins, news, and ways to contribute.
permalink: /community/
nav_group: project
archetype: project
---
{% assign navigation = site.data.navigation %}
{% assign discord = navigation.utility.items | where: "label", "Discord" | first %}
{% assign code = navigation.utility.items | where: "label", "Code" | first %}
{% assign software = navigation.groups.items | where: "label", "Software" | first %}
{% assign plugins = software.links.items | where: "label", "Plugins" | first %}

<section class="prose" aria-labelledby="community-start-title">
  <h2 id="community-start-title">The system is personal. The work around it doesn't have to be.</h2>
  <p>Omarchy gets more useful when people compare setups, trade fixes, write plugins, and meet in the same room. Start with the conversation, then follow the thread that fits what you want to do.</p>
  {% if discord %}
  <p class="button-group"><a class="button" href="{{ discord.url }}" rel="noreferrer">Join the Discord</a></p>
  {% endif %}
</section>

<section class="prose" aria-labelledby="community-places-title">
  <h2 id="community-places-title">Find your people and your next idea</h2>
  <ul>
    <li><a href="{{ '/meetups/' | relative_url }}">Meetups</a> collect local gatherings and practical guidance for bringing people together.</li>
    <li><a href="{{ '/workstations/' | relative_url }}">Workstations</a> is where community desks and their stories belong. The gallery only publishes cleared submissions.</li>
    <li><a href="{{ '/teams/rangers/' | relative_url }}">Rangers</a> is the route to the people helping care for the community.</li>
    {% if plugins %}<li><a href="{{ plugins.url }}" rel="noreferrer">Plugins</a> is the authoritative catalog for extensions made around Omarchy.</li>{% endif %}
    <li><a href="{{ '/news/' | relative_url }}">News</a> follows releases, events, and the project work worth knowing about.</li>
  </ul>
</section>

<section class="prose" aria-labelledby="community-contribute-title">
  <h2 id="community-contribute-title">Bring a useful thing</h2>
  <p>A good contribution can be a patch, a plugin, a careful answer, a meetup, or a workstation photo another person can learn from. Start where the work is visible, and use the route that matches it.</p>
  <ul>
    {% if code %}<li>For code, start at <a href="{{ code.url }}" rel="noreferrer">the Omarchy repository</a>.</li>{% endif %}
    {% if plugins %}<li>For an extension, publish it through <a href="{{ plugins.url }}" rel="noreferrer">Plugins</a>.</li>{% endif %}
    <li>For community stewardship, visit the <a href="{{ '/teams/rangers/' | relative_url }}">Rangers</a>.</li>
    {% if discord %}<li>For a question, an idea, or a photo you want considered for the gallery, bring it to <a href="{{ discord.url }}" rel="noreferrer">Discord</a>.</li>{% endif %}
  </ul>
</section>
