// 1. Get slug
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// 2. DOM
const contentEl = document.getElementById("content");

// 3. Load JSON
fetch("data/articles.json")
  .then(res => res.json())
  .then(articles => {

    const article = articles.find(a => a.slug === slug);

    if (!article) {
      contentEl.innerHTML = "<p>Article not found</p>";
      return;
    }

    return fetch(`./articles/${article.file}`);
  })
  .then(res => res.text())
  .then(html => {
    contentEl.innerHTML = html;
  })
  .catch(err => {
    contentEl.innerHTML = "<p>Error loading article.</p>";
    console.error(err);
  });