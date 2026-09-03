---
layout: landing
title: Project
description: Follow Omarchy through current community, news, foundation work, and exploratory Labs.
permalink: /project/
lang: en
translation_key: project
nav_group: project
archetype: landing
markdown: false
---
<div class="home-section home-section--reading">
  <div class="home-section__inner home-section__inner--narrow">
    <p class="home-eyebrow">The Project</p>
    <h1>A desktop gets better when people make it better.</h1>
    <p class="home-section__intro">Follow the work in News, find people and places in Community, and see the public support behind it through the Omacom Foundation. Labs is different: a home for experiments, not a product announcement.</p>
  </div>
</div>

<section class="home-section home-section--reading home-section--storm" aria-labelledby="project-paths-title">
  <div class="home-section__inner">
    <h2 id="project-paths-title">Take a project path</h2>
    <ul class="home-card-grid" role="list">
      <li class="home-card">
        <a class="home-card__link" href="{{ '/news/' | relative_url }}">
          <h3>News</h3>
          <p>Releases, events, and the people doing the work.</p>
          <span aria-hidden="true">Read the News →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/community/' | relative_url }}">
          <h3>Community</h3>
          <p>Meetups, contributors, workstations, plugins, and the places Omarchs gather.</p>
          <span aria-hidden="true">Find the community →</span>
        </a>
      </li>
      <li class="home-card">
        <a class="home-card__link" href="{{ '/foundation/' | relative_url }}">
          <h3>Omacom Foundation</h3>
          <p>The public foundation work that supports the project.</p>
          <span aria-hidden="true">Meet the Foundation →</span>
        </a>
      </li>
      {% assign labs = site.data.products.groups.project %}
      {% include product-cards.html products=labs description='summary' cta_prefix='Explore' %}
    </ul>
  </div>
</section>

<section class="home-section home-section--reading" aria-labelledby="project-routes-title">
  <div class="home-section__inner home-section__inner--narrow">
    <h2 id="project-routes-title">More ways into the work</h2>
    <ul>
      <li><a href="{{ '/teams/' | relative_url }}">Teams</a> — the people caring for the project.</li>
      <li><a href="{{ '/security/' | relative_url }}">Security</a> — responsible disclosure and security guidance.</li>
      <li><a href="{{ '/air/' | relative_url }}">Artists in Residence</a> — creative work connected to Omarchy.</li>
      <li><a href="{{ '/meetups/' | relative_url }}">Meetups</a> — local gatherings around the world.</li>
      <li><a href="{{ '/patrons/' | relative_url }}">Patrons</a> and <a href="{{ '/sponsorships/' | relative_url }}">Sponsorships</a> — public support for the Foundation and its work.</li>
    </ul>
  </div>
</section>
