set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

serve:
    scripts/serve

build:
    scripts/build

assets:
    scripts/build-assets

assets-check:
    scripts/build-assets --check

deploy:
    scripts/deploy

ship:
    scripts/ship
