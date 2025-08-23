# Progress: Browser-based Snake Game (MVP)

Last updated: 2025-08-23 19:10 (local)

## What Works
- Memory Bank with core project documentation (brief, product context, instructions, active context, system patterns, tech context)
- ES module-based Snake MVP implemented and runnable as static files
  - 20×20 grid, initial snake length 3, single food spawn
  - Deterministic loop at 150 ms default; update order: input → move → collisions/food → render
  - Keyboard controls (Arrow keys/WASD) with 180° reversal prevention
  - Wall/self collisions trigger Game Over overlay with Restart (no page reload)
  - Live, accessible score display (aria-live)
  - Leaderboard persisted in browser localStorage; shows top 10 scores and prompts for a player name on Game Over
  - Difficulty levels: Easy (200 ms), Medium (150 ms), Hard (100 ms) selectable from UI; applies on start/restart
- Modular separation: state, input, logic, renderer, loop

## What's Left to Build
- Accessibility pass (validate ARIA and focus states thoroughly)
- Cross-browser verification (Chrome/Firefox/Edge/Safari, latest two versions)
- Optional polish: sounds, themes, mobile touch controls (out of MVP scope)

## Known Issues and Limitations
- No automated tests are defined
- Visual style minimal by design; no localization

## Evolution of Project Decisions
- Confirmed framework-free, static approach to keep MVP simple and portable
- Adopted deterministic update pipeline and input queue for predictability
- Emphasized separation of logic and rendering to enable future testing and maintenance
- Added pause on tab hidden via visibilitychange for better UX
- Introduced difficulty levels with the state-backed tick interval; selection restart applies new speed


---

Updated: 2025-08-23 19:15 (local)

Planned Next Actions
- Cross-browser test sweep (Chrome, Firefox, Edge, Safari; latest two versions): play a full round; verify controls, reversal prevention, collisions, overlay visibility, restart behavior, difficulty speeds; confirm zero console errors.
- Accessibility check: verify tab order; ensure overlay dialog traps focus and returns it to Restart; confirm aria-live usage for score and leaderboard is polite and not spammy; ensure all interactive elements have labels.
- Usability and polish: confirm canvas DPR sizing looks crisp on HiDPI; confirm visibilitychange pause/resume; ensure focus outlines are visible across browsers.
- Documentation: add run instructions and record testing findings here; establish a lightweight regression checklist.

How to Run Locally
- Use a simple static server from the project root:
  - npx serve .
  - or: python3 -m http.server
- Open http://localhost:3000 (serve default) or http://localhost:8000 (python) in your browser.
- Controls: Arrow keys/WASD. Use the Restart button after Game Over. Difficulty can be changed via the selector.

---

Updated: 2025-08-23 19:21 (local)

Publishing
- See README.md for step-by-step instructions to:
  - Push this project to a new/existing GitHub repository
  - Publish via GitHub Pages using either Settings (branch → root) or GitHub Actions (included workflow)
- Tip: Keep `.nojekyll` to disable Jekyll and serve ES modules/assets as-is.

---

Updated: 2025-08-23 19:23 (local)

Containerization
- Added Dockerfile using nginx:alpine to serve the static app from /usr/share/nginx/html.
- Added docker-compose.yml to build and run the container, mapping host 8080 -> container 80.

How to Run with Docker
- docker build -t snake-game .
- docker run --rm -p 8080:80 snake-game

How to Run with Docker Compose
- docker compose up --build
- Then open http://localhost:8080 in your browser.

Notes
- This approach keeps the app framework-free and portable; no Node runtime is required in the container.
- For local iteration without rebuilds, you can uncomment the volumes in docker-compose.yml to bind-mount index.html, styles.css, and src/ (read-only).

---

Updated: 2025-08-23 19:25 (local)

Local Dev Server (Node-based)
- Added package.json with a lightweight dev server and hot reload using live-server.
- How to use:
  - npm install
  - npm run dev # opens http://localhost:5173 with live reload on changes to src/, index.html, styles.css
- Notes:
  - This does not introduce a build step; it only serves static files with live reload for faster iteration.
  - Docker Compose continues to serve on http://localhost:8080 via nginx and is unaffected.


---

Updated: 2025-08-23 19:43 (local)

Documentation Update
- README.md updated to include npm-based dev server usage.
  - Steps: `npm install`, `npm run dev` (opens http://localhost:5173 with hot reload), or `npm start` (alias)
  - Notes: hot reload watches src/, index.html, styles.css; no build step introduced
- Retained simple static server options: `npx serve .` or `python3 -m http.server` with their respective default ports.
