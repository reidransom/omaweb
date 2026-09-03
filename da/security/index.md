---
layout: content
title: Sikkerhed hos Omarchy
description: Sådan rapporterer du ansvarligt en sikkerhedssårbarhed i Omarchy.
permalink: /security/
lang: da
translation_key: security
nav_group: project
archetype: project
---
<section class="prose" aria-labelledby="security-report-title">
  <h2 id="security-report-title">Rapportér en sårbarhed</h2>
  <p>Hvis du mener, at du har fundet en sikkerhedssårbarhed i Omarchy, skal du fortælle det privat til <a href="{{ '/teams/' | localized_url }}#security">Omarchy Security Team</a>, så holdet får mulighed for at undersøge og rette den, før den offentliggøres.</p>
  <p class="button-group"><a class="button" href="mailto:security@omarchy.org?subject=Security%20report">security@omarchy.org</a></p>
  <p>Rapportér ikke potentielle sårbarheder offentligt i GitHub Issues, på Discord eller på sociale medier, før de er løst.</p>
</section>

<section class="prose" aria-labelledby="security-scope-title">
  <h2 id="security-scope-title">Hvad er en sårbarhed?</h2>
  <p>En fejl er en sikkerhedssårbarhed, når den kan udnyttes til at krydse en væsentlig sikkerhedsgrænse: En part, der ikke er betroet eller har færre privilegier, får adgang, tilladelser eller kontrol, som parten ikke allerede havde.</p>
  <p>Kode, der kunne være mere robust, men ikke krydser en sikkerhedsgrænse, er en forbedring, ikke en sikkerhedssårbarhed. En foreslået rettelse kan stadig blive flettet ind og krediteret i udgivelsesnoterne.</p>
  <p>Retten til <a href="{{ '/security/credits/' | localized_url }}">sikkerhedskreditering</a> afhænger af, om en rapport identificerer en bekræftet sikkerhedssårbarhed, ikke af sårbarhedens alvorlighedsgrad.</p>
</section>

<section class="prose" aria-labelledby="security-details-title">
  <h2 id="security-details-title">Det skal du medtage</h2>
  <p>Giv holdet nok oplysninger til at forstå og genskabe problemet:</p>
  <ul>
    <li>Den berørte komponent og Omarchy-version.</li>
    <li>En forklaring på, hvad en angriber kan gøre før og efter udnyttelsen.</li>
    <li>Trin til at genskabe problemet og eventuel proof of concept.</li>
    <li>Dine foretrukne kontaktoplysninger til opfølgning.</li>
  </ul>
</section>

<section class="prose" aria-labelledby="security-disclosure-title">
  <h2 id="security-disclosure-title">Ansvarlig offentliggørelse</h2>
  <p>Handl i god tro, mens du undersøger og rapporterer sårbarheder:</p>
  <ul>
    <li>Test kun systemer og konti, som du ejer eller har udtrykkelig tilladelse til at teste.</li>
    <li>Undgå krænkelser af privatlivet, driftsforstyrrelser, ødelæggelse af data og forringelse af tjenester.</li>
    <li>Udnyt ikke en sårbarhed ud over det, der er nødvendigt for at påvise den.</li>
    <li>Giv holdet en rimelig mulighed for at undersøge og løse problemet, før du offentliggør detaljer.</li>
  </ul>
  <p>Holdet gennemgår din rapport og holder dig orienteret i det omfang, det er muligt, mens det arbejder på en løsning.</p>
</section>

<section class="prose" aria-labelledby="security-credits-title">
  <h2 id="security-credits-title">Kreditering</h2>
  <p>Sikkerhedsforskere, der privat rapporterer en bekræftet sikkerhedssårbarhed og giver holdet mulighed for at udgive en rettelse, takkes på siden med <a href="{{ '/security/credits/' | localized_url }}">sikkerhedskrediteringer</a>. Accepterede forbedringer, der ikke krydser en sikkerhedsgrænse, kan stadig blive krediteret i udgivelsesnoterne.</p>
  <p>Ved flere rapporter om samme sårbarhed er kun den første rapportør berettiget til kreditering.</p>
</section>

<section class="prose" aria-labelledby="security-bugs-title">
  <h2 id="security-bugs-title">Almindelige fejl og support</h2>
  <p>Alt, der ikke er en sikkerhedssårbarhed, skal indberettes via <a href="https://github.com/omacom/omarchy/issues" rel="noreferrer">Omarchys GitHub Issues</a>.</p>
</section>
