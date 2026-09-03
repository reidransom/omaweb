---
layout: content
title: Communauté
description: Trouvez les membres d’Omarchy, les rencontres, les postes de travail, les Rangers, les Plugins, les actualités et les façons de contribuer.
permalink: /community/
lang: fr
translation_key: community
nav_group: project
archetype: project
---
{% assign discord = site.data.destinations.items.discord %}
{% assign code = site.data.destinations.items.code %}
{% assign plugins = site.data.destinations.items.plugins %}
{% assign community_navigation = site.data.navigation.sections.community %}
{% capture code_link %}{% include authoritative-link.html destination='code' label='dépôt Omarchy' %}{% endcapture %}
{% capture plugins_link %}{% include authoritative-link.html destination='plugins' label='Plugins' %}{% endcapture %}
{% capture discord_link %}{% include authoritative-link.html destination='discord' label='Discord' %}{% endcapture %}

<nav class="prose section-landing-prose" aria-labelledby="community-contents-title">
  <h2 id="community-contents-title">Dans cette section</h2>
  <ul>
{% for link_key in community_navigation.links %}
{% assign link = site.data.navigation.links[link_key] %}
{% capture community_link %}{% include authoritative-link.html link=link %}{% endcapture %}
<li>{{ community_link | strip_newlines | strip }}<span class="section-toc__description"> : {{ link.description | escape }}</span></li>
{% endfor %}
  </ul>
</nav>

<section class="prose section-landing-prose" aria-labelledby="community-start-title">
  <h2 id="community-start-title">Le système est personnel. Le travail qui l’entoure n’a pas besoin de l’être.</h2>
  <p>Omarchy devient plus utile lorsque les gens comparent leurs configurations, échangent des solutions, écrivent des Plugins et se retrouvent dans une même pièce. Commencez par la conversation, puis suivez le chemin qui correspond à ce que vous voulez faire.</p>
  {% if discord %}
  <p class="button-group">{% include authoritative-link.html destination='discord' label='Rejoindre Discord' class='button' %}</p>
  {% endif %}
</section>


<section class="prose section-landing-prose" aria-labelledby="community-contribute-title">
  <h2 id="community-contribute-title">Apportez quelque chose d’utile</h2>
  <p>Une bonne contribution peut être un correctif, un Plugin, une réponse réfléchie, une rencontre ou la photo d’un poste de travail dont d’autres peuvent apprendre. Commencez là où le travail est visible, puis choisissez le chemin adapté.</p>
  <ul>
    {% if code %}<li>Pour le code, commencez dans le {{ code_link | strip_newlines | strip }}.</li>{% endif %}
    {% if plugins %}<li>Publiez une extension via {{ plugins_link | strip_newlines | strip }}.</li>{% endif %}
    <li>Pour aider à prendre soin de la communauté, découvrez les <a href="{{ '/teams/rangers/' | localized_url }}">Rangers</a>.</li>
    {% if discord %}<li>Vous avez une question, une idée ou une photo à proposer pour la galerie ? Apportez-la sur {{ discord_link | strip_newlines | strip }}.</li>{% endif %}
  </ul>
</section>
