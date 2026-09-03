---
layout: content
title: Udvalgte videoer
description: Se den officielle introduktion og fire perspektiver fra fællesskabet, som er udvalgt til Omarchys landingsside.
permalink: /community/featured-videos/
lang: da
translation_key: featured-videos
nav_group: project
archetype: project
---
<section aria-labelledby="featured-videos-title">
<h2 id="featured-videos-title" class="u-visually-hidden">Videoer om Omarchy</h2>
<ol class="featured-videos" role="list">
{% for video in site.data.featured_videos.items %}
<li class="featured-video">
<a class="featured-video__facade" href="https://www.youtube.com/watch?v={{ video.youtube_id }}" aria-label="Se {{ video.title | escape }} af {{ video.creator | escape }} på YouTube">
<img src="{{ video.thumbnail | relative_url }}" width="1280" height="720" alt="{{ video.title | escape }} af {{ video.creator | escape }}" loading="lazy" decoding="async">
<span class="featured-video__play" aria-hidden="true">
<svg viewBox="0 0 68 48"><path d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.7a8.6 8.6 0 0 0-6 6A89.7 89.7 0 0 0 0 24a89.7 89.7 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.7a8.6 8.6 0 0 0 6-6A89.7 89.7 0 0 0 68 24a89.7 89.7 0 0 0-1.5-16.3z" fill="#f00"></path><path d="M27 34.3 44.8 24 27 13.7z" fill="#fff"></path></svg>
</span>
</a>
<div class="featured-video__caption">
<h3><a href="https://www.youtube.com/watch?v={{ video.youtube_id }}">{{ video.title | escape }}</a></h3>
<p>{{ video.creator | escape }}</p>
</div>
</li>
{% endfor %}
</ol>
</section>
