set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

serve:
    scripts/serve

build:
    scripts/build css
    scripts/build js
    jigyll build -s . --unpublished
    npx --no-install pagefind --site _site --output-path pagefind

assets:
    scripts/build-assets

assets-check:
    scripts/build-assets --check

deploy:
    scripts/deploy

ship:
    scripts/ship
