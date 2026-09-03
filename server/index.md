---
layout: content
title: Server
description: An exploratory set of questions about self-hosting, serious workloads, and administration that stays close to the operator.
permalink: /server/
lang: en
translation_key: server
nav_group: platforms
archetype: product
product: server
---
<section class="prose" aria-labelledby="server-question-title">
  <h2 id="server-question-title">A server should leave the operator in charge.</h2>
  <p>Omarchy is exploring what an opinionated server stance could mean for people who run their own services and carry responsibility for the work behind them. The hard part is not putting another control panel in front of a machine. It is deciding which choices deserve a strong default and which must remain plainly yours.</p>
  <p>This is a set of questions, not a server product.</p>
</section>

<section class="prose" aria-labelledby="server-workloads-title">
  <h2 id="server-workloads-title">What should a focused base make easier to reason about?</h2>
  <ul>
    <li>Which self-hosted services and production workloads benefit from an opinionated starting point?</li>
    <li>How can remote administration stay legible when the machine is somewhere else?</li>
    <li>Where can agents help with infrastructure work without hiding the commands, files, or decisions from the operator?</li>
  </ul>
</section>

<section class="prose" aria-labelledby="server-defaults-title">
  <h2 id="server-defaults-title">Security and updates are design questions.</h2>
  <p>Defaults can reduce repetition. They can also conceal a choice that deserves inspection. Any exploration here has to ask what a responsible security posture looks like, which update decisions should be visible, and how an operator can understand a system before changing it.</p>
  <p>For the current system, begin with the {% include authoritative-link.html destination='iso' label='ISO' %} and the {% include authoritative-link.html destination='manual' label='Manual' %}.</p>
</section>
