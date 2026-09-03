---
layout: content
title: Fællesskab
description: Find Omarchy-folk, meetups, workstations, Rangers, plugins, nyheder og måder at bidrage på.
permalink: /community/
lang: da
translation_key: community
nav_group: project
archetype: project
---
{% assign discord = site.data.destinations.items | where: "slug", "discord" | first %}
{% assign code = site.data.destinations.items | where: "slug", "code" | first %}
{% assign plugins = site.data.destinations.items | where: "slug", "plugins" | first %}
{% assign community_navigation = site.data.navigation.sections | where: 'url', '/community/' | first %}
{% capture code_link %}{% include authoritative-link.html destination='code' label='Omarchy-repositoriet' %}{% endcapture %}
{% capture plugins_link %}{% include authoritative-link.html destination='plugins' label='Plugins' %}{% endcapture %}
{% capture discord_link %}{% include authoritative-link.html destination='discord' label='Discord' %}{% endcapture %}

<nav class="prose section-landing-prose" aria-labelledby="community-contents-title">
  <h2 id="community-contents-title">I dette afsnit</h2>
  <ul>
{% for link in community_navigation.links.items %}
{% capture community_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ community_link | strip_newlines | strip }}<span class="section-toc__description">: {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="community-start-title">
  <h2 id="community-start-title">Systemet er personligt. Arbejdet omkring det behøver ikke være det.</h2>
  <p>Omarchy bliver mere nyttigt, når folk sammenligner opsætninger, udveksler løsninger, skriver plugins og mødes i samme rum. Begynd med samtalen, og følg så det spor, der passer til det, du vil.</p>
  {% if discord %}
  <p class="button-group">{% include authoritative-link.html destination='discord' label='Deltag på Discord' class='button' %}</p>
  {% endif %}
</section>


<section class="prose section-landing-prose" aria-labelledby="community-contribute-title">
  <h2 id="community-contribute-title">Bidrag med noget nyttigt</h2>
  <p>Et godt bidrag kan være en rettelse, et plugin, et gennemtænkt svar, et meetup eller et billede af en workstation, som andre kan lære af. Begynd dér, hvor arbejdet er synligt, og vælg den vej, der passer til det.</p>
  <ul>
    {% if code %}<li>For kode skal du begynde i {{ code_link | strip_newlines | strip }}.</li>{% endif %}
    {% if plugins %}<li>Udgiv en udvidelse via {{ plugins_link | strip_newlines | strip }}.</li>{% endif %}
    <li>Vil du være med til at passe på fællesskabet, så besøg <a href="{{ '/teams/rangers/' | localized_url }}">Rangers</a>.</li>
    {% if discord %}<li>Har du et spørgsmål, en idé eller et billede, du gerne vil foreslå til galleriet, så tag det med til {{ discord_link | strip_newlines | strip }}.</li>{% endif %}
  </ul>
</section>
