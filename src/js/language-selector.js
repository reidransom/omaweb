const SELECTOR = "details[data-language-selector]";

export const initLanguageSelector = () => {
  const selectors = [...document.querySelectorAll(SELECTOR)];

  if (selectors.length === 0) return;

  document.addEventListener("click", (event) => {
    for (const selector of selectors) {
      if (selector.open && !selector.contains(event.target)) selector.open = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    const selector = selectors.find((candidate) => candidate.open);

    if (!selector) return;

    const toggle = selector.querySelector("summary");

    if (event.key === "Escape") {
      event.preventDefault();
      selector.open = false;
      toggle?.focus();
      return;
    }

    if (event.key === "ArrowDown" && event.target === toggle) {
      event.preventDefault();
      selector.querySelector("a")?.focus();
    }
  });
};
