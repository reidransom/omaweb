---
layout: content
title: Sécurité d’Omarchy
description: Comment signaler de façon responsable une vulnérabilité de sécurité dans Omarchy.
permalink: /security/
lang: fr
translation_key: security
nav_group: project
archetype: project
---
<section class="prose" aria-labelledby="security-report-title">
  <h2 id="security-report-title">Signaler une vulnérabilité</h2>
  <p>Si vous pensez avoir trouvé une vulnérabilité de sécurité dans Omarchy, signalez-la en privé à l’<a href="{{ '/teams/' | localized_url }}#security">équipe de sécurité Omarchy</a> afin qu’elle puisse l’examiner et la corriger avant toute divulgation publique.</p>
  <p class="button-group"><a class="button" href="mailto:security@omarchy.org?subject=Security%20report">security@omarchy.org</a></p>
  <p>Ne signalez pas publiquement de vulnérabilités potentielles dans les issues GitHub, sur Discord ou sur les réseaux sociaux avant leur résolution.</p>
</section>

<section class="prose" aria-labelledby="security-scope-title">
  <h2 id="security-scope-title">Qu’est-ce qu’une vulnérabilité ?</h2>
  <p>Un défaut constitue une vulnérabilité de sécurité lorsqu’il permet de franchir une frontière de sécurité significative : un acteur non fiable ou moins privilégié obtient un accès, des autorisations ou un contrôle qu’il ne possédait pas déjà.</p>
  <p>Un code qui pourrait être plus robuste, mais ne franchit aucune frontière de sécurité, relève d’une amélioration et non d’une vulnérabilité. Un correctif proposé peut tout de même être intégré et crédité dans les notes de version.</p>
  <p>L’éligibilité aux <a href="{{ '/security/credits/' | localized_url }}">crédits de sécurité</a> dépend du fait qu’un signalement identifie une vulnérabilité confirmée, pas de sa gravité.</p>
</section>

<section class="prose" aria-labelledby="security-details-title">
  <h2 id="security-details-title">Informations à inclure</h2>
  <p>Donnez à l’équipe suffisamment d’informations pour comprendre et reproduire le problème :</p>
  <ul>
    <li>Le composant affecté et la version d’Omarchy.</li>
    <li>Une explication de ce qu’un attaquant peut faire avant et après l’exploitation.</li>
    <li>Les étapes de reproduction et toute preuve de concept disponible.</li>
    <li>Vos coordonnées préférées pour le suivi.</li>
  </ul>
</section>

<section class="prose" aria-labelledby="security-disclosure-title">
  <h2 id="security-disclosure-title">Divulgation responsable</h2>
  <p>Agissez de bonne foi lorsque vous recherchez et signalez des vulnérabilités :</p>
  <ul>
    <li>Testez uniquement les systèmes et les comptes que vous possédez ou pour lesquels vous avez reçu une autorisation explicite.</li>
    <li>Évitez les atteintes à la vie privée, les perturbations d’activité, la destruction de données et la dégradation des services.</li>
    <li>N’exploitez pas une vulnérabilité au-delà de ce qui est nécessaire pour la démontrer.</li>
    <li>Laissez à l’équipe une possibilité raisonnable d’examiner et de résoudre le problème avant d’en publier les détails.</li>
  </ul>
  <p>L’équipe examinera votre signalement et vous tiendra informé dans la mesure du possible pendant qu’elle travaille à une résolution.</p>
</section>

<section class="prose" aria-labelledby="security-credits-title">
  <h2 id="security-credits-title">Crédits</h2>
  <p>Les chercheurs en sécurité qui signalent en privé une vulnérabilité confirmée et laissent à l’équipe le temps de publier un correctif sont remerciés sur la page des <a href="{{ '/security/credits/' | localized_url }}">crédits de sécurité</a>. Les améliorations acceptées qui ne franchissent pas une frontière de sécurité peuvent tout de même être créditées dans les notes de version.</p>
  <p>Lorsque plusieurs personnes signalent la même vulnérabilité, seule la première peut recevoir un crédit.</p>
</section>

<section class="prose" aria-labelledby="security-bugs-title">
  <h2 id="security-bugs-title">Bugs ordinaires et assistance</h2>
  <p>Tout problème qui n’est pas une vulnérabilité de sécurité doit être signalé dans les <a href="https://github.com/omacom/omarchy/issues" rel="noreferrer">issues GitHub d’Omarchy</a>.</p>
</section>
