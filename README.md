# Portfolio Template Builder

A small web tool to quickly create a stylish, responsive static portfolio (HTML) from a simple form. Designed to be exported and deployed to GitHub Pages.

Features:
- Enter full name, about, projects (title + description), skills and contact email.
- Add / remove projects and skills (tags).
- One-click generate, preview in an iframe, and download a standalone HTML file ready to publish.
- Glass-morphism UI, Bootstrap 5.3, jQuery 3.7, and Rajdhani font.

Files:
- `index.html` — main app UI and form
- `style.css` — styling and glass-morphism theme
- `script.js` — handling the form, generation, preview and download
- `README.md` — this file

How to use:
1. Open `index.html` in your browser.
2. Fill out your details, add projects and skills.
3. Click "Preview" to view the generated portfolio, or "Generate & Download" to save a standalone `portfolio.html`.

Deploy to GitHub Pages:
1. Create a new GitHub repository (public).
2. Add the generated `portfolio.html` file to the repository root and commit (or push via git).
3. In the repository, go to Settings → Pages.
4. Under "Source", choose "main" branch and "/ (root)", then Save.
5. Visit the provided URL after a minute or two: `https://<username>.github.io/<repo>/`

For a user site (published at `https://<username>.github.io`) name the repository `<username>.github.io`.

Notes / Next steps (ideas you can extend):
- Add image upload for projects and inline base64 embedding.
- Provide a ZIP export containing index.html + assets.
- Integrate GitHub OAuth + API to push directly to a repository and publish (requires server-side token handling or explicit permission flows).
- Add more templates/styles and let users choose a theme.

License: MIT