const createResult = ({ url, title, excerpt }) => {
  const item = document.createElement("article");
  const heading = document.createElement("h3");
  const link = document.createElement("a");
  const summary = document.createElement("p");

  link.href = url;
  link.textContent = title;
  heading.append(link);
  summary.textContent = new DOMParser().parseFromString(excerpt, "text/html").body.textContent;
  item.append(heading, summary);

  return item;
};

const initNewsSearch = () => {
  const form = document.querySelector("[data-news-search-form]");
  if (!form) return;

  const query = form.elements.q;
  const results = document.querySelector("[data-news-search-results]");
  const pagefindUrl = form.dataset.pagefindUrl;
  let pagefind;

  const search = async () => {
    const term = query.value.trim();
    if (!term) {
      results.replaceChildren();
      return;
    }

    results.textContent = "Searching…";

    try {
      pagefind ??= await import(pagefindUrl);
      const response = await pagefind.search(term);
      const documents = await Promise.all(response.results.map((result) => result.data()));
      const fragment = document.createDocumentFragment();

      if (documents.length === 0) {
        results.textContent = "No matching stories.";
        return;
      }

      documents.forEach((document) => fragment.append(createResult(document)));
      results.replaceChildren(fragment);
    } catch {
      results.textContent = "Search is unavailable. Browse the full archive or a category instead.";
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });
};

export { initNewsSearch };
