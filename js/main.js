fetch("data/articles.json")
    .then(res => res.json())
    .then(articles => {

        const listEl = document.getElementById("articles-list");
        const searchInput = document.getElementById("search-input");
        const monthFilter = document.getElementById("month-filter");
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        const pageInfo = document.getElementById("page-info");

        let currentPage = 1;
        const perPage = 5;
        let filteredData = [...articles];

        // 🔹 Helper: extract metadata from MD
        async function getMeta(article) {
            const res = await fetch(`./articles/${article.file}`);
            const text = await res.text();

            const parts = text.split('---');

            let meta = { title: "No Title", date: "" };

            if (parts.length >= 3) {
                const fm = parts[1].trim();

                fm.split("\n").forEach(line => {
                    const [key, ...rest] = line.split(":");
                    const value = rest.join(":").trim();

                    if (key.trim() === "title") meta.title = value;
                    if (key.trim() === "date") meta.date = value;
                });
            }

            return meta;
        }

        // 🔹 Load all metadata once
        async function enrichArticles() {
            const enriched = await Promise.all(
                articles.map(async a => {
                    const meta = await getMeta(a);
                    return { ...a, ...meta };
                })
            );

            return enriched;
        }

        enrichArticles().then(data => {
            articles = data;

            // SORT
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // LATEST
            const latest = articles[0];
            document.getElementById("latest-title").textContent = latest.title;
            document.getElementById("latest-date").textContent = latest.date;
            document.getElementById("latest-card").onclick = () => {
                window.location.href = `article.html?slug=${latest.slug}`;
            };

            filteredData = [...articles];

            // 🔹 Dynamic month filter
            const uniqueMonths = [...new Set(
                articles.map(a => {
                    const d = new Date(a.date);
                    return `${d.getFullYear()}-${d.getMonth()}`;
                })
            )];

            uniqueMonths.sort((a, b) => new Date(b) - new Date(a));

            uniqueMonths.forEach(val => {
                const [year, month] = val.split("-");
                const date = new Date(year, month);

                const option = document.createElement("option");
                option.value = val;
                option.textContent = date.toLocaleString("default", {
                    month: "long",
                    year: "numeric"
                });

                monthFilter.appendChild(option);
            });

            // 🔹 Render
            function renderList(data) {
                const totalPages = Math.ceil(data.length / perPage) || 1;

                const start = (currentPage - 1) * perPage;
                const paginated = data.slice(start, start + perPage);

                listEl.innerHTML = paginated.map(article => `
          <div class="card" onclick="window.location.href='article.html?slug=${article.slug}'">
            <h3>${article.title}</h3>
            <p class="date">${article.date}</p>
          </div>
        `).join("");

                pageInfo.textContent = `${currentPage} / ${totalPages}`;
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
            }

            function applyFilters() {
                const query = searchInput.value.trim().toLowerCase();
                const selected = monthFilter.value;

                filteredData = articles.filter(a => {
                    const matchesSearch = a.title.toLowerCase().includes(query);

                    const d = new Date(a.date);
                    const val = `${d.getFullYear()}-${d.getMonth()}`;
                    const matchesMonth = selected === "" || val === selected;

                    return matchesSearch && matchesMonth;
                });

                currentPage = 1;
                renderList(filteredData);
            }

            // EVENTS
            searchInput.addEventListener("input", applyFilters);
            monthFilter.addEventListener("change", applyFilters);

            prevBtn.addEventListener("click", () => {
                currentPage--;
                renderList(filteredData);
            });

            nextBtn.addEventListener("click", () => {
                currentPage++;
                renderList(filteredData);
            });

            // INIT
            renderList(filteredData);
        });

    })
    .catch(err => console.error(err));