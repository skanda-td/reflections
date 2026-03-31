// 1. Get slug
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// 2. DOM
const titleEl = document.getElementById("title");
const dateEl = document.getElementById("date");
const contentEl = document.getElementById("content");

// 3. Load JSON
fetch("data/articles.json")
    .then(res => res.json())
    .then(articles => {

        const article = articles.find(a => a.slug === slug);

        if (!article) {
            titleEl.textContent = "Article not found";
            return;
        }

        return fetch(`articles/${article.file}`);
    })
    .then(res => res.text())
    .then(text => {

        // 🔹 Extract frontmatter
        const parts = text.split('---');

        let metadata = {};
        let content = text;

        if (parts.length >= 3) {
            const fm = parts[1].trim();

            fm.split("\n").forEach(line => {
                const [key, ...rest] = line.split(":");
                metadata[key.trim()] = rest.join(":").trim();
            });

            content = parts.slice(2).join('---').trim();
        }

        // 🔹 Set title + date
        titleEl.textContent = metadata.title || "No Title";
        dateEl.textContent = metadata.date || "";

        // 🔹 Render markdown
        contentEl.innerHTML = marked.parse(content);
    })
    .catch(err => {
        contentEl.innerHTML = "<p>Error loading article.</p>";
        console.error(err);
    });