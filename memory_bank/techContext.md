# Tech Context: Browser-based Snake Game (MVP)

## Technologies Used
- JavaScript (ES6 modules)
- HTML5 Canvas for rendering
- Basic CSS for layout and overlays

## Development Setup
- No build tooling required; plain ES modules loaded via `<script type="module">`
- Recommended local run options:
  - Node-based with hot reload: `npm run dev` (live-server on http://localhost:5173)
  - Generic static server (no reload): `npx serve .` or `python3 -m http.server`
- Organize code into modules: state, input, loop, logic/update, renderer
- Keep tick interval configurable (default 150 ms) via a constant or settings module

## Technical Constraints
- Static, front-end-only MVP (no backend)
- Framework-free; avoid external libraries unless strictly necessary
- Support the latest two major versions of Chrome, Firefox, Edge, Safari
- Deterministic update order: input → move → collisions/food → render
- Accessibility: keyboard operability, minimal ARIA on interactive elements
- Hazard items: a single “shrinker” emoji item may appear on the grid based on a spawn probability that depends on difficulty (Easy ≈ 30%, Medium ≈ 50%, Hard ≈ 70%). When eaten, it reduces snake length by 1 (net vs previous tick) and decreases score by 1 (clamped to 0). After eating normal food, any existing shrinker is marked to disappear and is cleared at the start of the next tick (between ticks, after the new food has already spawned). When absent, each game tick has a chance to spawn a new shrinker; it will not immediately reappear on the same tick that food was eaten, and we also skip spawning on the tick when the deferred disappearance occurs. Hazard placement always avoids overlapping with the snake and the food.

## Dependencies
- None required beyond browser APIs for runtime
- Optional dev dependency: `live-server` for local development with hot reload (configured via npm scripts)
  - Scripts: `npm run dev` (opens index.html on port 5173) and `npm start` (alias)

## Persistence Decisions
- Leaderboard is stored per difficulty in browser localStorage under keys:
  - `snake.leaderboard.v2.easy`, `snake.leaderboard.v2.medium`, `snake.leaderboard.v2.hard`.
- Schema (each list): array of entries `{ name: string, score: number, difficulty: 'easy'|'medium'|'hard', durationMs: number, ts: epochMillis }`.
  - Migration: legacy combined key `snake.leaderboard.v1` is automatically migrated on first load by splitting entries into the per‑difficulty keys and trimming each list to the top 10; the legacy key is then removed.
  - Backward compatibility: older entries without `difficulty` are treated as `medium`; older entries without `durationMs` default to 0 when displayed.
- Ordering: score desc, then timestamp asc; each difficulty list is capped to top 10.
- UI renders three separate leaderboards (Easy, Medium, Hard). Each board shows only results from games played at that difficulty; saving a score only affects that difficulty’s list.
- Name entry is handled only on the Welcome overlay (pre-start). The name field is prefilled with the last used name from any leaderboard (fallback "Player"). The Play button is enabled when the name is non-empty; pressing Enter in the field starts the game. Global Space/Enter shortcuts are not used.

## Theming
- Approach: CSS custom properties define a theme palette. The active theme is controlled via `html[data-theme="light"|"dark"]`.
- Canvas integration: the renderer reads CSS variables (`--canvas-bg`, `--grid-line`, `--snake-head`, `--snake-body`, `--food`) via `getComputedStyle` to keep canvas visuals in sync with the CSS theme.
- Palette (color‑vision friendly): snake head = blue `#3a7afe`, snake body = purple `#9467bd`, food = orange `#ff7f0e`. Avoids red/green confusion and maintains strong contrast on both light and dark backgrounds.
- Persistence: user selection stored in `localStorage` under `snake.theme.v1`. First-load default follows `prefers-color-scheme` if no stored preference exists.
- Accessibility: header button toggles theme, exposes `aria-label` and `aria-pressed`, and has clear focus styles.
- Difficulty UI: a three-button toggle group (Easy/Medium/Hard) with aria-pressed reflects the current selection; keyboard accessible (Tab to a button, Space/Enter to choose). The control is visible on both the Welcome and Game Over states.
  - Behavior:
    - Before first start or on the Game Over screen: changing difficulty does not auto-start; the selection applies on the next Play/Restart.
    - While the game is running: changing difficulty restarts immediately to apply speed and music tempo.

## Tool Usage Patterns
- Prefer pure functions for state transitions to improve predictability and testability
- Use a direction queue for input to avoid mid-tick mutations
- Use requestAnimationFrame only for render smoothness if needed; game logic is governed by setInterval or a fixed-timestep loop (150 ms default)
- Keep rendering side effects isolated; state and logic remain framework-agnostic
- Auto-pause/resume using document visibilitychange for better UX without complicating the loop
- Global movement key bindings are disabled when the Game Over overlay is visible; only overlay-specific handlers (e.g., Enter in the name field) remain active.

## HUD
- Branding: A lightweight, inline SVG logo (snake head + wavy body + food pellet) uses theme CSS variables for colors. It appears in the header (compact) and on the Welcome overlay (larger). The header h1 retains accessible text; the overlay logo is aria-hidden to avoid redundancy with headings.
- The score is centered in the top bar and displayed larger for prominence. It includes a live rank indicator compared to the leaderboard (top 10 persisted).
  - Display format: "Score: N · Rank: #R" when within top 10; otherwise ">10" is shown for rank outside the top list.
  - The score briefly shakes when the provisional leaderboard rank changes (e.g., when entering a new rank tier). This is a non-disruptive visual cue; aria-live remains polite.
  - Rank is computed client-side each tick using current score vs persisted entries; ties break by earlier timestamp first, consistent with leaderboard ordering.
- Visual FX: A brief floating "Go Go Go !!1" text is shown over the board on start/restart; eating normal food triggers a floating "Nom Nom 😋"; eating a non‑eatable shrinker triggers a floating "Take this MFKR 🤮"; Game Over triggers a flash/shake and a floating text.

## Audio
- Implementation: Web Audio API, no assets. Sounds are synthesized (oscillators + gain envelopes) for minimal footprint and retro feel.
- Background music:
  - A lightweight, looping chiptune-style melody (square-wave lead + triangle bass) plays during gameplay.
  - Tempo varies by difficulty: Easy ≈ 110 BPM, Medium ≈ 140 BPM, Hard ≈ 170 BPM; short notes scheduled at beat intervals. Volume is mixed under SFX via a master Gain node.
  - Starts on game start/restart and pauses on game over or when the page is hidden; resumes when gameplay resumes.
- Effects:
  - Food: quick two-note square wave ("coin-like").
  - Hazard (non-eatable shrinker): a short dissonant, downward chirp to contrast the food sound.
  - Death: descending sawtooth sweep with a low sine "thud".
  - Start: short triangle-wave arpeggio.
- Integration points:
  - loop.js observes score delta per tick to infer food consumption (keeps logic.step pure-ish) and listens for fxEatShrinker to play the hazard SFX.
  - Game over transition triggers death sound; start/restart triggers start jingle and starts the background music.
- Autoplay policy: AudioContext created lazily and resumed on first gesture (pointerdown/keydown).
- Controls: header sound toggle button with aria-pressed and icon swap; session-scoped mute setting (not persisted for MVP). Muting also stops background music immediately.
