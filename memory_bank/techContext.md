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

## Dependencies
- None required beyond browser APIs for runtime
- Optional dev dependency: `live-server` for local development with hot reload (configured via npm scripts)
  - Scripts: `npm run dev` (opens index.html on port 5173) and `npm start` (alias)

## Persistence Decisions
- Leaderboard stored in browser localStorage under key `snake.leaderboard.v1`.
- Schema: array of entries `{ name: string, score: number, difficulty: 'easy'|'medium'|'hard', durationMs: number, ts: epochMillis }`.
  - Backward compatibility: older entries without `difficulty` are treated as `medium`; older entries without `durationMs` default to 0 when displayed.
- Sorted by score desc, then timestamp asc; capped to top 10 entries.
- Input for a name is collected via a non-blocking input field in the Game Over overlay. The field is prefilled with the last used name if available (derived from the most recent leaderboard entry by timestamp), otherwise "Player". A single button ("Play Agayn") persists the entry and immediately starts the next game; pressing Enter in the name field does the same. Global Space/Enter shortcuts are not used.

## Theming
- Approach: CSS custom properties define a theme palette. The active theme is controlled via `html[data-theme="light"|"dark"]`.
- Canvas integration: the renderer reads CSS variables (`--canvas-bg`, `--grid-line`, `--snake-head`, `--snake-body`, `--food`) via `getComputedStyle` to keep canvas visuals in sync with the CSS theme.
- Palette (color‑vision friendly): snake head = blue `#3a7afe`, snake body = purple `#9467bd`, food = orange `#ff7f0e`. Avoids red/green confusion and maintains strong contrast on both light and dark backgrounds.
- Persistence: user selection stored in `localStorage` under `snake.theme.v1`. First-load default follows `prefers-color-scheme` if no stored preference exists.
- Accessibility: header button toggles theme, exposes `aria-label` and `aria-pressed`, and has clear focus styles.
- Difficulty UI: a three-button toggle group (Easy/Medium/Hard) with aria-pressed reflects the current selection; keyboard accessible (Tab to a button, Space/Enter to choose). Game restarts on change to apply speed and music tempo.

## Tool Usage Patterns
- Prefer pure functions for state transitions to improve predictability and testability
- Use a direction queue for input to avoid mid-tick mutations
- Use requestAnimationFrame only for render smoothness if needed; game logic is governed by setInterval or a fixed-timestep loop (150 ms default)
- Keep rendering side effects isolated; state and logic remain framework-agnostic
- Auto-pause/resume using document visibilitychange for better UX without complicating the loop
- Global movement key bindings are disabled when the Game Over overlay is visible; only overlay-specific handlers (e.g., Enter in the name field) remain active.

## HUD
- The score is centered in the top bar and displayed larger for prominence. It includes a live rank indicator compared to the leaderboard (top 10 persisted).
  - Display format: "Score: N · Rank: #R" when within top 10; otherwise ">10" is shown for rank outside the top list.
  - The score briefly shakes when the provisional leaderboard rank changes (e.g., when entering a new rank tier). This is a non-disruptive visual cue; aria-live remains polite.
  - Rank is computed client-side each tick using current score vs persisted entries; ties break by earlier timestamp first, consistent with leaderboard ordering.
- Game Over overlay shows the provisional rank immediately (before the player enters a name or saves the score), using the same ranking logic and display format.

## Audio
- Implementation: Web Audio API, no assets. Sounds are synthesized (oscillators + gain envelopes) for minimal footprint and retro feel.
- Background music:
  - A lightweight, looping chiptune-style melody (square-wave lead + triangle bass) plays during gameplay.
  - Tempo varies by difficulty: Easy ≈ 110 BPM, Medium ≈ 140 BPM, Hard ≈ 170 BPM; short notes scheduled at beat intervals. Volume is mixed under SFX via a master Gain node.
  - Starts on game start/restart and pauses on game over or when the page is hidden; resumes when gameplay resumes.
- Effects:
  - Food: quick two-note square wave ("coin-like").
  - Death: descending sawtooth sweep with a low sine "thud".
  - Start: short triangle-wave arpeggio.
- Integration points:
  - loop.js observes score delta per tick to infer food consumption (keeps logic.step pure-ish).
  - Game over transition triggers death sound; start/restart triggers start jingle and starts the background music.
- Autoplay policy: AudioContext created lazily and resumed on first gesture (pointerdown/keydown).
- Controls: header sound toggle button with aria-pressed and icon swap; session-scoped mute setting (not persisted for MVP). Muting also stops background music immediately.
