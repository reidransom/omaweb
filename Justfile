set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# Watch Sass dependencies and serve pages on request with Jigyll.
serve:
    scripts/serve

# Build CSS and JavaScript, fully render the site, and refresh Pagefind.
build:
    scripts/build css
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
