# Reflections

A minimal, fast, and fully static blog built with HTML, CSS, and JavaScript.
It focuses on clean reading experience, search, filtering, and pagination without any backend.

# How to add a new article
1. Inside /articles/, create a new file:
    /articles/my-new-article.html
2. For html file check dummy.html
3. Update articles.json
    Open: /data/articles.json
    Add a new entry:
        {
            "slug": "my-new-article",
            "file": "my-new-article.html"
        }
4. Note: Be carful while adding new entry; anything manipulated, re-work!!!
5. slug must be unique and URL-friendly (my-new-article)
6. file must match exact filename
7. date must be in YYYY-MM-DD format
8. Always include h1 tag and .date in article file