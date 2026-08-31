import { scroll } from "motion";

const ENHANCED_HERO_QUERY = "(min-width: 40rem) and (prefers-reduced-motion: no-preference)";

export function initHomeHero() {
  const root = document.querySelector("[data-home-hero]");
  const primaryPanel = root?.querySelector("[data-home-hero-primary]");
  const actionPanel = root?.querySelector("[data-home-hero-actions]");

  if (!root || !primaryPanel || !actionPanel) return;

  const media = window.matchMedia(ENHANCED_HERO_QUERY);
  let disposeAnimations = () => {};
  const setPanelsAnimating = (active) => {
    document.body.toggleAttribute("data-home-hero-panels-animating", active);
  };

  const reset = () => {
    disposeAnimations();
    disposeAnimations = () => {};
    setPanelsAnimating(false);
    delete root.dataset.homeHeroEnhanced;
    primaryPanel.removeAttribute("style");
    actionPanel.removeAttribute("style");
  };

  const setup = () => {
    reset();
    if (!media.matches) return;

    const scrollOptions = {
      target: root,
      offset: ["start 100px", "end end"],
    };
    disposeAnimations = scroll((progress) => {
      const remaining = 1 - progress;
      setPanelsAnimating(progress < 1);
      primaryPanel.style.flexBasis = `${100 - (42 * progress)}%`;
      actionPanel.style.opacity = progress;
      actionPanel.style.transform = `translateX(${6 * remaining}vw) rotate(${2 * remaining}deg)`;
    }, scrollOptions);
  };

  setup();
  media.addEventListener("change", setup);
}
