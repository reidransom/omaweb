set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# Compile Sass natively, watch sources, and serve pages on request with Jigyll.
serve:
    mise exec -- jigyll serve -s . -w --unpublished

# Build JavaScript, render the site including Sass, and refresh Pagefind.
build:
    scripts/build js
    mise exec -- jigyll build -s . --unpublished
    npx --no-install pagefind --site _site --output-path pagefind

assets:
    scripts/build-assets

assets-check:
    scripts/build-assets --check

deploy:
    scripts/deploy

ship:
    scripts/ship
