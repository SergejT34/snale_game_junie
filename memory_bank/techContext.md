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
- Schema: array of entries `{ name: string, score: number, difficulty: 'easy'|'medium'|'hard', ts: epochMillis }`.
  - Backward compatibility: older entries without `difficulty` are treated as `medium`.
- Sorted by score desc, then timestamp asc; capped to top 10 entries.
- Input for a name collected via prompt() on Game Over to avoid complex UI; default name uses the last used name if available (derived from the most recent leaderboard entry by timestamp), otherwise "Player".

## Tool Usage Patterns
- Prefer pure functions for state transitions to improve predictability and testability
- Use a direction queue for input to avoid mid-tick mutations
- Use requestAnimationFrame only for render smoothness if needed; game logic is governed by setInterval or a fixed-timestep loop (150 ms default)
- Keep rendering side effects isolated; state and logic remain framework-agnostic
- Auto-pause/resume using document visibilitychange for better UX without complicating the loop
