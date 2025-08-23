# Snake Game (MVP)

A minimal, fully playable Snake game that runs in modern browsers using ES6 modules and HTML5 Canvas.

- 20×20 grid, snake length 3 at start, one food item
- Deterministic tick loop (150 ms default)
- Keyboard controls (Arrow keys/WASD) with 180° reversal prevention
- Live score, Game Over overlay, Restart without a page reload
- Difficulty selector (Easy/Medium/Hard)
- LocalStorage leaderboard (top 10)

## Run Locally

Option A — Hot reload dev server (recommended during development)

- npm install
- npm run dev
  - Opens http://localhost:5173 and reloads on changes to src/, index.html, styles.css
- You can also use: `npm start` (alias)

Option B — Simple static server (no reload)

- npx serve .
- or: python3 -m http.server
- Then open http://localhost:3000 (serve default) or http://localhost:8000 (python) and play.

## Publish on GitHub

You have two simple options to publish this as a website with GitHub Pages.

### Option A: Pages from the `main` branch (no CI)

1) Create a GitHub repository (on github.com) and copy its URL.

2) Initialize and push this project (from the project root):
    ```shell
    git init
    git add .
    git commit -m "Initial commit: Snake MVP"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USER>/<YOUR_REPO>.git
    git push -u origin main
    ```
3) Enable Pages from the repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Save
4) Wait for the Pages build to finish. Your site will be available at:
- https://<YOUR_USER>.github.io/<YOUR_REPO>/

Notes:
- This repo includes a `.nojekyll` file (recommended) so GitHub Pages serves files as-is.
- Because this is a static ES module app, no build step is required.

### Option B: GitHub Actions (automatic deploy on push)

This repository includes a ready-to-use workflow at `.github/workflows/gh-pages.yml` using the official Pages actions. To use it:

1) Push the repo to GitHub (same commands as above).

2) Grant the workflow permission to deploy:
   - Go to Settings → Pages → Build and deployment → Source: GitHub Actions
3) Push changes to `main`. The workflow will:
   - Check out the repo
   - Upload the site files as an artifact
   - Deploy to GitHub Pages
4) Find the site URL in the workflow summary or under Settings → Pages.

If you fork or rename the repo later, the site URL changes accordingly.

## Browser Support
The latest two major versions of Chrome, Firefox, Edge, and Safari.

## Accessibility
- Keyboard operable UI
- Minimal ARIA (aria-live score, dialog semantics)

## Project Structure
- index.html, styles.css
- src/: ES6 modules for state, input, logic, loop, renderer, leaderboard
- memory_bank/: living docs (brief, product/tech context, patterns, progress, active context)

## License
MIT (or your preferred license).
