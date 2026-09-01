---
name: news-article-images
description: Generate and integrate original Omarchy News editorial illustrations with nanobanana. Use whenever a user asks for a News story image, homepage news-card artwork, a replacement for the News fallback graphic, or matching artwork for several articles—even when they only say “do the same for the other stories.”
compatibility: Requires nanobanana, ImageMagick, jigyll, and NANOBANANA_API_KEY in ~/.env.
---

# Omarchy News article images

Create story-specific editorial illustrations that remain legible in the homepage card grid and hold up as full-width article media. Complete the source, derivatives, provenance, frontmatter, and rendered verification in one pass.

## 1. Ground the story

Read these before constructing a prompt:

- `../omaweb-docs/BRAND.md` for palette, visual character, and editorial claims.
- The target file under `_news/` for the concrete actor, event, mechanism, and outcome.
- `_includes/media.html`, `_layouts/article.html`, and one illustrated `_news/` file for the current image schema.
- `_data/assets.yml` and `scripts/build-assets` for provenance and derivative conventions.

Turn the article into a **visual mechanism**, not a generic technology scene. Examples of mechanisms: distribution becomes luminous routes across a globe; guidance becomes three people handing light toward newcomers; artistic residency becomes two workstations shaping one shared canvas.

Done when one sentence names the story truth and the visual mechanism that will make it recognizable without the headline.

## 2. Direct the illustration

Use a wide 16:9 composition with a strong central read at card size. Build the prompt from:

1. The specific story mechanism and number of important actors.
2. One concrete scene that expresses it.
3. Omarchy’s Night and Storm background palette with Terminal Blue, Cyan, Green, and restrained purple accents.
4. An original, non-photographic geometric editorial style with crisp detail and dark negative space.
5. Content boundaries: keep the image free of words, letters, numerals, logos, company marks, flags, money, identifiable real people, and fake product evidence.

Treat people as anonymous geometric figures. Keep community images warm rather than corporate or militaristic. An illustration may suggest the article’s facts; it must not masquerade as an event photograph, analytics screenshot, or product proof.

Prompt shape:

```text
Wide 16:9 editorial illustration for [specific Omarchy News story].
[Concrete visual mechanism and scene derived from the article].
[Desired emotional read and focal hierarchy].
Original non-photographic geometric composition, sophisticated, crisp detail,
dramatic depth, generous dark negative space, Omarchy Night and Storm background
palette with Terminal Blue, Cyan, Green, and restrained purple accents.
Keep the image free of words, letters, numerals, logos, brand marks, company marks,
identifiable real people, and photorealistic evidence.
```

## 3. Generate and select

Create an isolated scratch directory named `.scratch/nanobanana-<story-slug>`. Generate two composition variations:

```bash
. "$HOME/.env" && \
  GEMINI_API_KEY="$NANOBANANA_API_KEY" \
  nanobanana generate "$PROMPT" \
    --count=2 \
    --styles=modern,abstract \
    --variations=composition
```

The CLI requires `GEMINI_API_KEY`; this project stores the same credential as `NANOBANANA_API_KEY`. Source it without printing it, passing it as a command argument, or writing it into the repository.

Open both candidates. Select for:

- Immediate recognition at roughly 300×169 pixels.
- A clean silhouette and focal point.
- Meaningful distinction from existing homepage story art.
- Clean anatomy and geometry.
- Absence of accidental glyphs, logos, watermarks, and misleading UI.

Regenerate when neither candidate passes every check. Selection—not the first successful API response—is the completion criterion.

## 4. Preserve the approved source

Copy the selected candidate to:

```text
../omaweb-docs/images/news/<semantic-basename>.jpg
```

Use a semantic basename describing the mechanism, such as `omarchy-rangers-community-guides`; avoid dates and generic names such as `news-image`.

`nanobanana` may report a `.png` filename while writing JPEG bytes. Run `identify` and use the actual format for the destination extension. Record the source dimensions and SHA-256.

## 5. Register and render derivatives

Update all four places in `scripts/build-assets`:

1. Add a source variable under the existing News artwork sources.
2. Add the source to the approved-source loop.
3. Add 480w, 768w, and 1152w paths to `output_paths`.
4. Add a `render_responsive_family` call using `news_responsive_widths`.

Then run the bundled preservation wrapper from the repository root:

```bash
.agents/skills/news-article-images/scripts/render-news-family <semantic-basename>
```

The wrapper invokes the project’s sole derivative generator, captures the new News family, and restores every unrelated committed derivative. This matters because a local ImageMagick/WebP version can rewrite existing files byte-for-byte even when their pixels are unchanged.

Confirm the outputs are exactly 480×270, 768×432, and 1152×648. Record each SHA-256.

## 6. Register provenance and attach the story

Add one source record and three output records to `_data/assets.yml`, adjacent to the other News artwork. Use:

- `asset_type: image`
- `role: editorial-illustration`
- Provenance naming Google Gemini via nanobanana and the target announcement.
- `rights_owner: Omacom`
- `publication_status: cleared`
- `third_party_marks.present: false`
- The measured hashes and dimensions; never placeholders.

Add this image structure to the article frontmatter:

```yaml
image:
  src: /assets/images/news/<semantic-basename>-1152w.webp
  alt: <Concrete description of the visible composition.>
  width: 1152
  height: 648
  illustrative: true
  sizes: "(min-width: 72rem) 72rem, 100vw"
  sources:
    items:
      - type: image/webp
        srcset:
          items:
            - src: /assets/images/news/<semantic-basename>-480w.webp
              width: 480
            - src: /assets/images/news/<semantic-basename>-768w.webp
              width: 768
            - src: /assets/images/news/<semantic-basename>-1152w.webp
              width: 1152
```

Alt text describes visible content rather than repeating the headline. `illustrative: true` supplies the article disclosure that the image is not event photography or product evidence.

## 7. Verify the published surfaces

Run:

```bash
scripts/check-content
jigyll build --config _config.yml
```

Use the browser against the running `servd` site and verify:

- At desktop width, the target homepage or `/news/` card loads the new family and remains legible in the four-card grid.
- At desktop width, the article loads the same family with useful alt text and the illustration disclosure.
- At 390px, the card selects the 480w derivative, stays 16:9, and causes no horizontal overflow.
- At 390px, the article image stays 16:9, its alt text and disclosure remain present, and the page causes no horizontal overflow.

Run `scripts/build-assets --check` when the repository’s existing derivative set permits it. If an unrelated family fails first, report the exact path; do not rewrite its manifest or suppress the failure as part of this task.

After the smoke test passes, delete the `.scratch/nanobanana-<story-slug>` directory and all rejected candidates.

## Completion contract

The work is complete only when the selected source, three responsive derivatives, generator registration, provenance records, article frontmatter, illustration disclosure, desktop card, mobile card, and article page are all present and verified. Never leave generated drafts or unrelated derivative changes behind.
