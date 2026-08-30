---
layout: project
title: Security at Omarchy
description: How to responsibly report a security vulnerability in Omarchy.
permalink: /security/
nav_group: project
archetype: project
---
<section class="prose" aria-labelledby="security-report-title">
  <h2 id="security-report-title">Report a vulnerability</h2>
  <p>If you believe you have found a security vulnerability in Omarchy, tell the <a href="{{ '/teams/' | relative_url }}#security">Omarchy Security Team</a> privately so it has an opportunity to investigate and fix it before it is made public.</p>
  <p class="button-group"><a class="button" href="mailto:security@omarchy.org?subject=Security%20report">security@omarchy.org</a></p>
  <p>Do not report potential vulnerabilities publicly in GitHub Issues, Discord, or social media before they are resolved.</p>
</section>

<section class="prose" aria-labelledby="security-scope-title">
  <h2 id="security-scope-title">What is a vulnerability?</h2>
  <p>A bug is a security vulnerability when it can be exploited to cross a meaningful security boundary: an untrusted or lower-privileged party gains access, permissions, or control it did not already have.</p>
  <p>Code that could be more robust but does not cross a security boundary is an improvement, not a security vulnerability. A proposed fix may still be merged and credited in release notes.</p>
  <p>Eligibility for <a href="{{ '/security/credits/' | relative_url }}">security credits</a> depends on a report identifying a confirmed security vulnerability, not its severity.</p>
</section>

<section class="prose" aria-labelledby="security-details-title">
  <h2 id="security-details-title">What to include</h2>
  <p>Give the team enough information to understand and reproduce the issue:</p>
  <ul>
    <li>The affected component and Omarchy version.</li>
    <li>An explanation of what an attacker can do before and after exploitation.</li>
    <li>Steps to reproduce the issue and any proof of concept.</li>
    <li>Your preferred contact details for follow-up.</li>
  </ul>
</section>

<section class="prose" aria-labelledby="security-disclosure-title">
  <h2 id="security-disclosure-title">Responsible disclosure</h2>
  <p>Act in good faith while investigating and reporting vulnerabilities:</p>
  <ul>
    <li>Only test systems and accounts you own or have explicit permission to test.</li>
    <li>Avoid privacy violations, disruption, data destruction, and service degradation.</li>
    <li>Do not exploit a vulnerability beyond what is needed to demonstrate it.</li>
    <li>Give the team a reasonable opportunity to investigate and address the issue before publishing details.</li>
  </ul>
  <p>The team will review your report and keep you informed as it is able while it works toward a resolution.</p>
</section>

<section class="prose" aria-labelledby="security-credits-title">
  <h2 id="security-credits-title">Credits</h2>
  <p>Researchers who privately report a confirmed security vulnerability and give the team the chance to ship a fix are thanked on the <a href="{{ '/security/credits/' | relative_url }}">security credits</a> page. Accepted improvements that do not cross a security boundary may still be credited in release notes.</p>
  <p>For duplicate reports, only the first reporter is eligible for credit.</p>
</section>

<section class="prose" aria-labelledby="security-bugs-title">
  <h2 id="security-bugs-title">Regular bugs and support</h2>
  <p>For anything that is not a security vulnerability, use the <a href="https://github.com/omacom/omarchy/issues" rel="noreferrer">Omarchy issue tracker</a>.</p>
</section>
