set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

serve:
    jigyll serve

deploy:
    scripts/deploy

ship:
    scripts/ship
