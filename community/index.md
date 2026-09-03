---
layout: content
title: Community
description: Find Omarchy people, meetups, workstations, Rangers, plugins, news, and ways to contribute.
permalink: /community/
lang: en
translation_key: community
nav_group: project
archetype: project
---
{% assign discord = site.data.destinations.items | where: "slug", "discord" | first %}
{% assign code = site.data.destinations.items | where: "slug", "code" | first %}
{% assign plugins = site.data.destinations.items | where: "slug", "plugins" | first %}
{% assign community_navigation = site.data.navigation.sections | where: 'url', '/community/' | first %}
{% capture code_link %}{% include authoritative-link.html destination='code' label='the Omarchy repository' %}{% endcapture %}
{% capture plugins_link %}{% include authoritative-link.html destination='plugins' label='Plugins' %}{% endcapture %}
{% capture discord_link %}{% include authoritative-link.html destination='discord' label='Discord' %}{% endcapture %}

<nav class="prose section-landing-prose" aria-labelledby="community-contents-title">
  <h2 id="community-contents-title">In this section</h2>
  <ul>
{% for link in community_navigation.links.items %}
{% capture community_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ community_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="community-start-title">
  <h2 id="community-start-title">The system is personal. The work around it doesn't have to be.</h2>
  <p>Omarchy gets more useful when people compare setups, trade fixes, write plugins, and meet in the same room. Start with the conversation, then follow the thread that fits what you want to do.</p>
  {% if discord %}
  <p class="button-group">{% include authoritative-link.html destination='discord' label='Join the Discord' class='button' %}</p>
  {% endif %}
</section>


<section class="prose section-landing-prose" aria-labelledby="community-contribute-title">
  <h2 id="community-contribute-title">Bring a useful thing</h2>
  <p>A good contribution can be a patch, a plugin, a careful answer, a meetup, or a workstation photo another person can learn from. Start where the work is visible, and use the route that matches it.</p>
  <ul>
    {% if code %}<li>For code, start at {{ code_link | strip_newlines | strip }}.</li>{% endif %}
    {% if plugins %}<li>For an extension, publish it through {{ plugins_link | strip_newlines | strip }}.</li>{% endif %}
    <li>For community stewardship, visit the <a href="{{ '/teams/rangers/' | relative_url }}">Rangers</a>.</li>
    {% if discord %}<li>For a question, an idea, or a photo you want considered for the gallery, bring it to {{ discord_link | strip_newlines | strip }}.</li>{% endif %}
  </ul>
</section>
