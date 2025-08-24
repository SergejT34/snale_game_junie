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


---

Updated: 2025-08-23 19:48 (local)

UI/Links
- Added a GitHub icon link in the top bar that opens the source repository in a new tab.
  - Location: header right side, next to the score and difficulty selector
  - URL: https://github.com/SergejT34/snale_game_junie
  - Accessibility: includes aria-label, focus-visible outline; SVG marked aria-hidden
- Minor CSS added for hover/focus states without affecting layout.

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


---

Updated: 2025-08-23 19:48 (local)

UI/Links
- Added a GitHub icon link in the top bar that opens the source repository in a new tab.
  - Location: header right side, next to the score and difficulty selector
  - URL: https://github.com/SergejT34/snale_game_junie
  - Accessibility: includes aria-label, focus-visible outline; SVG marked aria-hidden
- Minor CSS added for hover/focus states without affecting layout.


---

Updated: 2025-08-23 19:52 (local)

Name Prompt Default
- Changed name prompt default from hard-coded "Player" to the last used name if available.
  - Implementation: on Game Over, default is computed by scanning persisted leaderboard entries for the latest timestamp and using that entry's name; falls back to "Player" when none.
  - Rationale: improves UX by not forcing repeat typing for the same player.
  - Docs: techContext.md updated to reflect new defaulting behavior.



---

Updated: 2025-08-23 20:39 (local)

Controls Update
- Removed global Space/Enter shortcuts for restarting from the Game Over overlay.
  - Rationale: simplify input model and avoid unexpected restarts from global keys.
- Game Over overlay now auto-focuses the player name input. Pressing Enter in that input saves the score and starts a new game.
- The overlay button label is now "Play Agayn".


---

Updated: 2025-08-23 20:24 (local)

Accessibility (Color Vision)
- Updated in-game colors to be red–green colorblind‑friendly.
  - Snake head remains blue (#3a7afe) for continuity and contrast.
  - Snake body changed from green to purple (#9467bd).
  - Food changed from red to orange (#ff7f0e).
  - Changes applied via CSS variables for both light and dark themes, and renderer fallbacks updated to match.
  - Rationale: avoid red/green confusion while keeping high contrast against canvas backgrounds; improves distinguishability of snake vs. food for users with deuteranopia/protanopia.

---

Updated: 2025-08-23 20:29 (local)

Game Over Details and Leaderboard Rank
- Game Over overlay now shows:
  - Time: duration of the run in mm:ss
  - Difficulty: Easy/Medium/Hard label for the run
  - Rank: the player's rank on the leaderboard after saving the score (e.g., #3). If outside top 10, the numerical rank is still computed but only the top 10 are displayed in the list.
- Implementation details:
  - index.html: added elements final-time, final-difficulty, final-rank to the overlay.
  - renderer.js: now fills in time and difficulty when the overlay is shown.
  - leaderboard.js: addScore now returns an object { entries, rank }, computing the player's rank before truncating to the top 10 and persisting.
  - main.js: uses the returned rank to update the overlay and re-renders the leaderboard.
- Rationale: provides better feedback at game end and aligns with persistence schema already tracking difficulty and duration.


---

Updated: 2025-08-23 20:50 (local)

Game Over Focus Reliability
- Ensured the player name input is focused every time the Game Over overlay opens.
  - Implementation: renderer.js now detects the hidden→shown transition of the overlay and focuses/selects the #player-name input after making the overlay visible (with a micro-delay for cross‑browser consistency).
  - Rationale: Timing issues could cause focus to be lost if set before the overlay becomes visible; focusing at the point of showing guarantees consistent UX.


---

Updated: 2025-08-23 20:52 (local)

Sound Effects and Mute Toggle
- Added a lightweight Web Audio-based sound module (src/audio.js) with three effects:
  - Food: short two-note "coin" bleep on eating food.
  - Death: descending tone with a thud on game over.
  - Start: brief arpeggio on game start and restart.
- Integration:
  - loop.js detects score increases per tick to trigger the food sound without altering logic.step.
  - Game over transition triggers the death sound.
  - Starting/restarting the game plays the start jingle.
- UI:
  - A sound toggle button was added to the header (id="sound-toggle"). It is keyboard-accessible and indicates state via aria-pressed and icon swap.
  - CSS updates ensure the correct icon is shown when muted/unmuted.
- Accessibility/Policy:
  - AudioContext is lazily initialized and resumed on first user interaction (pointer/key) to comply with browser autoplay policies.
  - Users can disable sounds at any time; the setting is session-scoped (no persistence yet, by design for MVP).


---

Updated: 2025-08-24 16:03 (local)

Background Music
- Added continuous, looping background music during gameplay, inspired by classic platformers.
  - Implementation: procedural chiptune using Web Audio API (square-wave lead + triangle bass), no external assets.
  - Behavior: starts on game start/restart; pauses on game over and when the tab is hidden; resumes when gameplay resumes.
  - Integration: loop.js calls startMusic()/stopMusic() alongside existing SFX triggers.
  - Controls: existing sound toggle also mutes/stops the background music.
- Rationale: enhance game feel without increasing bundle size or adding asset licensing complexity.


---

Updated: 2025-08-24 16:07 (local)

Background Music Tempo by Difficulty
- Music tempo now adapts to the selected difficulty.
  - Mapping: Easy ≈ 110 BPM, Medium ≈ 140 BPM, Hard ≈ 170 BPM.
  - Implementation: audio.js now accepts a BPM in startMusic and computes beat/note durations dynamically; loop.js passes BPM based on the current difficulty on start/restart/visibility resume.
- Controls: existing header sound toggle mutes/unmutes all audio and stops music immediately when muted (unchanged behavior, documented here for clarity).
- Rationale: aligns game feel with difficulty setting without adding assets.


---

Updated: 2025-08-24 16:12 (local)

Difficulty UI: Toggle Button Group
- Replaced the difficulty <select> with a three-button toggle group (Easy/Medium/Hard) in the header.
  - Accessibility: uses aria-pressed on buttons and is fully keyboard-operable (Tab + Space/Enter).
  - Behavior: selecting a difficulty immediately restarts the game to apply speed and background music tempo changes.
  - Implementation: a small shim in main.js exposes a select-like API (value + change events) so existing loop.js and main.js logic required no changes.


---

Updated: 2025-08-24 16:16 (local)

Centered Score and Rank Shake
- Score display moved to the center of the top bar and enlarged for better visibility.
  - Implementation: top bar switched to CSS grid (three columns: left title, centered score, right controls). #score now uses larger font and bold weight.
- Rank change feedback: the score element now briefly shakes whenever the provisional leaderboard rank changes during play.
  - Implementation: renderer tracks the last shown rank and toggles a CSS animation class when the rank changes; accessible as aria-live remains polite and atomic.
- No functional changes to leaderboard logic; purely presentational with a small UI cue.


---

Updated: 2025-08-24 16:20 (local)

Welcome Overlay and Leaderboard Placement
- Added a Welcome overlay that is shown on page load. It contains:
  - A difficulty toggle group (Easy/Medium/Hard)
  - A Play button
  - The Leaderboard (top 10 from localStorage)
- The persistent sidebar leaderboard was removed; the leaderboard is now only visible on the Welcome overlay per product requirement.
- The game no longer auto-starts; it starts after the user presses Play. Difficulty can be chosen before starting.
- After Game Over, the existing overlay is used to save the score and immediately restart. The leaderboard remains exclusive to the Welcome overlay.


---

Updated: 2025-08-24 16:29 (local)

Unified Welcome/Game Over Overlay
- Removed the separate Game Over overlay view. The Welcome overlay now also serves as the Game Over screen.
- On game over, the Welcome overlay reappears showing final score, time, difficulty, rank, and a save form ("Save & Play Again").
- Renderer now targets the Welcome overlay for game-over visibility and fills in run details; it hides the Welcome section and shows the Game Over section as appropriate.
- The leaderboard remains on the Welcome overlay (exclusive placement preserved).

# Progress: Browser-based Snake Game (MVP)

Last updated: 2025-08-24 16:33 (local)

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
  - npm run dev # opens http://localhost:5173 with hot reload on changes to src/, index.html, styles.css
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


---

Updated: 2025-08-23 19:48 (local)

UI/Links
- Added a GitHub icon link in the top bar that opens the source repository in a new tab.
  - Location: header right side, next to the score and difficulty selector
  - URL: https://github.com/SergejT34/snale_game_junie
  - Accessibility: includes aria-label, focus-visible outline; SVG marked aria-hidden
- Minor CSS added for hover/focus states without affecting layout.

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
  - npm run dev # opens http://localhost:5173 with hot reload on changes to src/, index.html, styles.css
- Notes:
  - This does not introduce a build step; it only serves static files with live reload for faster iteration.
  - Docker Compose continues to serve on http://localhost:8080 via nginx and is unaffected.


---

Updated: 2025-08-24 16:20 (local)

Welcome Overlay and Leaderboard Placement
- Added a Welcome overlay that is shown on page load. It contains:
  - A difficulty toggle group (Easy/Medium/Hard)
  - A Play button
  - The Leaderboard (top 10 from localStorage)
- The persistent sidebar leaderboard was removed; the leaderboard is now only visible on the Welcome overlay per product requirement.
- The game no longer auto-starts; it starts after the user presses Play. Difficulty can be chosen before starting.
- After Game Over, the existing overlay is used to save the score and immediately restart. The leaderboard remains exclusive to the Welcome overlay.


---

Updated: 2025-08-24 16:29 (local)

Unified Welcome/Game Over Overlay
- Removed the separate Game Over overlay view. The Welcome overlay now also serves as the Game Over screen.
- On game over, the Welcome overlay reappears showing final score, time, difficulty, rank, and a save form ("Save & Play Again").
- Renderer now targets the Welcome overlay for game-over visibility and fills in run details; it hides the Welcome section and shows the Game Over section as appropriate.
- The leaderboard remains on the Welcome overlay (exclusive placement preserved).


---

Updated: 2025-08-24 16:33 (local)

Difficulty Change on Game Over
- Difficulty control is now visible on the Game Over screen (same overlay), allowing users to adjust difficulty after a run.
- Behavior changes:
  - When the game is running, changing difficulty still restarts immediately to apply speed and music tempo.
  - When on the Game Over screen (or before the first start), changing difficulty no longer auto-starts; the new selection is applied on the next Play/Restart. This prevents accidental loss of the chance to save a score.


---

Updated: 2025-08-24 16:37 (local)

Single Start/Restart Overlay and Name Requirement
- Consolidated to one overlay that serves both as the pre-start screen and the Game Over screen; same UI and flow for starting and restarting.
- The name input is now required before the first play: the Play button remains disabled until a non-empty name is entered.
- After Game Over, the same overlay shows final stats and the button reads "Save & Play Again"; saving persists the score and immediately restarts at the chosen difficulty.

---

Updated: 2025-08-24 16:42 (local)

Welcome Name Prefill and Enter-to-Start
- The welcome view now pre-fills the player name with the last known name from the leaderboard (fallback "Player").
- Pressing Enter in the name field on the welcome view starts the game. The Play button is enabled when the name is non-empty (satisfied by the prefill).

---

Updated: 2025-08-24 16:44 (local)

Removed Game Over Screen (Auto-save & Auto-restart)
- The Game Over screen has been removed completely. When a run ends, the app does not display any overlay.
- Behavior:
  - The game automatically saves the score using the current player name (from the welcome input, falling back to the last known name) and the selected difficulty and duration.
  - The leaderboard re-renders immediately to reflect the new entry.
  - After a short delay (~900 ms) to allow the death sound to play, the game restarts automatically at the current difficulty.
- Rationale: streamline the loop and meet the requirement to remove the Game Over screen entirely, while preserving persistence and flow.

---

Updated: 2025-08-24 16:56 (local)

Bugfix: Start overlay is shown after Game Over
- Change: On game over, we now re-show the unified start overlay with final stats (score, time, difficulty, rank) instead of auto-restarting without any overlay.
- Implementation:
  - main.js: onGameOver now saves the score, updates the overlay contents, shows the overlay, and wires the button to restart the game; it previously auto-restarted after a delay.
  - renderer.js: continues to keep overlays hidden during gameplay; it does not force-hide them on game over, allowing main.js to display the overlay.
- Rationale: Aligns behavior with requirement to show the start overlay after game over and provide an explicit restart.
- UX: The Play button reads "Play again" on the Game Over view; pressing Enter in the name field also restarts. Leaderboard updates immediately after saving.


---

Updated: 2025-08-24 16:59 (local)

Game Over View: Hide Stats
- Change: The Game Over overlay no longer shows run stats (Score, Time, Difficulty, Rank).
- Implementation: main.js onGameOver now explicitly hides final-score, final-time, final-difficulty, and final-rank elements while still showing the overlay with the "Play again" button and updated leaderboard.
- Rationale: Aligns with the requirement to not show stats on the Game Over view while preserving the overlay for restart and leaderboard visibility.

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

Updated: 2025-08-24 17:08 (local)

Leaderboards by Difficulty: Per‑difficulty Storage
- Change: Leaderboard persistence now saves and loads per difficulty under separate localStorage keys.
  - Keys: snake.leaderboard.v2.easy, snake.leaderboard.v2.medium, snake.leaderboard.v2.hard.
  - Saving a score only updates the list for the selected difficulty; each UI board shows only its difficulty.
- Migration: legacy combined key (snake.leaderboard.v1) is auto-migrated on first load by splitting entries and trimming to top 10 per difficulty. The legacy key is then removed.
- Rank: Provisional rank and saved rank computations now operate only within the selected difficulty list (unchanged behavior, but now avoids scanning other difficulties).
- UI: No changes required; main.js already renders each board via getTopByDifficulty.
- Backward compatibility: Entries missing difficulty default to Medium; durationMs defaults to 0.

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
  - npm run dev # opens http://localhost:5173 with hot reload on changes to src/, index.html, styles.css
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


---

Updated: 2025-08-23 19:48 (local)

UI/Links
- Added a GitHub icon link in the top bar that opens the source repository in a new tab.
  - Location: header right side, next to the score and difficulty selector
  - URL: https://github.com/SergejT34/snale_game_junie
  - Accessibility: includes aria-label, focus-visible outline; SVG marked aria-hidden
- Minor CSS added for hover/focus states without affecting layout.

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
  - npm run dev # opens http://localhost:5173 with hot reload on changes to src/, index.html, styles.css
- Notes:
  - This does not introduce a build step; it only serves static files with live reload for faster iteration.
  - Docker Compose continues to serve on http://localhost:8080 via nginx and is unaffected.


---

Updated: 2025-08-24 16:20 (local)

Welcome Overlay and Leaderboard Placement
- Added a Welcome overlay that is shown on page load. It contains:
  - A difficulty toggle group (Easy/Medium/Hard)
  - A Play button
  - The Leaderboard (top 10 from localStorage)
- The persistent sidebar leaderboard was removed; the leaderboard is now only visible on the Welcome overlay per product requirement.
- The game no longer auto-starts; it starts after the user presses Play. Difficulty can be chosen before starting.
- After Game Over, the existing overlay is used to save the score and immediately restart. The leaderboard remains exclusive to the Welcome overlay.


---

Updated: 2025-08-24 16:29 (local)

Unified Welcome/Game Over Overlay
- Removed the separate Game Over overlay view. The Welcome overlay now also serves as the Game Over screen.
- On game over, the Welcome overlay reappears showing final score, time, difficulty, rank, and a save form ("Save & Play Again").
- Renderer now targets the Welcome overlay for game-over visibility and fills in run details; it hides the Welcome section and shows the Game Over section as appropriate.
- The leaderboard remains on the Welcome overlay (exclusive placement preserved).


---

Updated: 2025-08-24 16:33 (local)

Difficulty Change on Game Over
- Difficulty control is now visible on the Game Over screen (same overlay), allowing users to adjust difficulty after a run.
- Behavior changes:
  - When the game is running, changing difficulty still restarts immediately to apply speed and music tempo.
  - When on the Game Over screen (or before the first start), changing difficulty no longer auto-starts; the new selection is applied on the next Play/Restart. This prevents accidental loss of the chance to save a score.


---

Updated: 2025-08-24 16:37 (local)

Single Start/Restart Overlay and Name Requirement
- Consolidated to one overlay that serves both as the pre-start screen and the Game Over screen; same UI and flow for starting and restarting.
- The name input is now required before the first play: the Play button remains disabled until a non-empty name is entered.
- After Game Over, the same overlay shows final stats and the button reads "Save & Play Again"; saving persists the score and immediately restarts at the chosen difficulty.

---

Updated: 2025-08-24 16:42 (local)

Welcome Name Prefill and Enter-to-Start
- The welcome view now pre-fills the player name with the last known name from the leaderboard (fallback "Player").
- Pressing Enter in the name field on the welcome view starts the game. The Play button is enabled when the name is non-empty (satisfied by the prefill).

---

Updated: 2025-08-24 16:44 (local)

Removed Game Over Screen (Auto-save & Auto-restart)
- The Game Over screen has been removed completely. When a run ends, the app does not display any overlay.
- Behavior:
  - The game automatically saves the score using the current player name (from the welcome input, falling back to the last known name) and the selected difficulty and duration.
  - The leaderboard re-renders immediately to reflect the new entry.
  - After a short delay (~900 ms) to allow the death sound to play, the game restarts automatically at the current difficulty.
- Rationale: streamline the loop and meet the requirement to remove the Game Over screen entirely, while preserving persistence and flow.

---

Updated: 2025-08-24 16:56 (local)

Bugfix: Start overlay is shown after Game Over
- Change: On game over, we now re-show the unified start overlay with final stats (score, time, difficulty, rank) instead of auto-restarting without any overlay.
- Implementation:
  - main.js: onGameOver now saves the score, updates the overlay contents, shows the overlay, and wires the button to restart the game; it previously auto-restarted after a delay.
  - renderer.js: continues to keep overlays hidden during gameplay; it does not force-hide them on game over, allowing main.js to display the overlay.
- Rationale: Aligns behavior with requirement to show the start overlay after game over and provide an explicit restart.
- UX: The Play button reads "Play again" on the Game Over view; pressing Enter in the name field also restarts. Leaderboard updates immediately after saving.


---

Updated: 2025-08-24 16:59 (local)

Game Over View: Hide Stats
- Change: The Game Over overlay no longer shows run stats (Score, Time, Difficulty, Rank).
- Implementation: main.js onGameOver now explicitly hides final-score, final-time, final-difficulty, and final-rank elements while still showing the overlay with the "Play again" button and updated leaderboard.
- Rationale: Aligns with the requirement to not show stats on the Game Over view while preserving the overlay for restart and leaderboard visibility.

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

Updated: 2025-08-24 17:08 (local)

Leaderboards by Difficulty: Per‑difficulty Storage
- Change: Leaderboard persistence now saves and loads per difficulty under separate localStorage keys.
  - Keys: snake.leaderboard.v2.easy, snake.leaderboard.v2.medium, snake.leaderboard.v2.hard.
  - Saving a score only updates the list for the selected difficulty; each UI board shows only its difficulty.
- Migration: legacy combined key (snake.leaderboard.v1) is auto-migrated on first load by splitting entries and trimming to top 10 per difficulty. The legacy key is then removed.
- Rank: Provisional rank and saved rank computations now operate only within the selected difficulty list (unchanged behavior, but now avoids scanning other difficulties).
- UI: No changes required; main.js already renders each board via getTopByDifficulty.
- Backward compatibility: Entries missing difficulty default to Medium; durationMs defaults to 0.

---

Updated: 2025-08-24 17:12 (local)

Leaderboards: Show Only Selected Difficulty
- Change: Only one leaderboard is visible at a time, matching the currently selected difficulty. Players can switch boards by changing the difficulty.
- Implementation: main.js now includes updateLeaderboardVisibility() which hides non-selected leaderboards (via display:none and aria-hidden), and is called:
  - after initial leaderboard render,
  - whenever the difficulty changes,
  - after re-rendering on Game Over.
- Default: The Medium leaderboard is shown by default to match the initial difficulty selection.
- Accessibility: aria-hidden is updated appropriately for non-visible lists.


---

Updated: 2025-08-24 17:15 (local)

Leaderboards: Hide Non-selected Sections (Headers Included)
- Change: Only the currently selected difficulty's leaderboard section is visible. Other difficulties' entire sections (including their headers/captions) are hidden.
- Implementation: main.js updateLeaderboardVisibility() now hides the wrapper container around each leaderboard <ol> (which includes the <h4> heading) via display:none and sets aria-hidden accordingly. The selected section remains visible. The master "Leaderboards" title stays visible.
- Triggers: Applied on initial load, on difficulty change, and after re-rendering on Game Over.
- Rationale: Aligns with the requirement to show exactly one leaderboard table at a time with its header/caption, improving clarity and accessibility.

---

Updated: 2025-08-24 17:17 (local)

Leaderboard UI: Remove Main Heading and Center Full-Width Layout
- Change: Removed the generic "Leaderboards" heading from the overlay; only the per-difficulty heading (Easy/Medium/Hard) remains for the currently visible board.
- Layout: The leaderboard area now spans the full width and is centered in the view. The multi-column grid was replaced with a single full-width block. Each leaderboard list (<ol>) is set to width:100%.
- Files:
  - index.html: removed h3#leaderboard-title; changed .leaderboards-grid to display:block; added width:100%, margin:0 auto, text-align:center; set each <ol> to width:100%.
- Rationale: Matches the requirement that the leaderboard has no overall heading and appears centered while filling the available width. Visibility per selected difficulty remains unchanged.


---

Updated: 2025-08-24 17:27 (local)

Focus Management: Blur Name and Play When Game Starts
- Change: When the game starts or restarts, the player-name input and the Play button are explicitly blurred so they do not retain focus while gameplay is running. Focus is moved to the canvas.
- Implementation:
  - main.js: in both start flows (initial Play and Game Over “Play again”), added nameInput.blur() and saveBtn.blur() before starting/restarting, then canvas.focus().
- Rationale: Prevents hidden controls from retaining focus when the overlay is dismissed; improves keyboard UX and adheres to accessibility guidelines.

---

Updated: 2025-08-24 17:29 (local)

Header Score: Show Player Name, Difficulty, and Rank Holder
- Change: The top bar score section now also shows the current player name and the selected difficulty. Next to the rank, it shows the name of the player who currently holds that rank; if that is the current player, it displays “You”.
- Implementation:
  - renderer.js now composes the score header as: "Score: <points> · Player: <name> · Difficulty: <Easy/Medium/Hard> · Rank: #N — <holder|You>".
  - Provisional rank is computed per current difficulty; holder name is taken from the corresponding leaderboard top list.
  - Player name is read from the welcome overlay input (fallback "Player").
- Notes:
  - The header updates live during gameplay and reflects difficulty changes on restart (as before).
  - Accessibility: #score remains aria-live="polite" and aria-atomic="true" so updates are announced succinctly.

  ---

  Updated: 2025-08-24 17:36 (local)

  Leaderboard: Highlight Current Score After Game Over
  - Change: After saving the score on Game Over, the corresponding leaderboard line is highlighted if that leaderboard is currently visible (i.e., matches the selected difficulty).
  - Implementation:
    - main.js: after re-rendering leaderboards and applying visibility, clears any previous highlights and adds class "highlight" plus aria-current="true" to the saved rank’s list item when within the visible list.
    - styles.css: added .leaderboard li.highlight styling to visually emphasize the row (accent outline and subtle background).
  - Scope/Behavior:
    - Only the visible difficulty’s leaderboard can get highlighted; others remain unchanged.
    - If the saved rank is outside the displayed range (e.g., > top 10), nothing is highlighted.
    - Changing difficulty removes highlight from previous board as part of the next render cycle.
  - Accessibility: aria-current="true" helps assistive technologies announce the current item.
