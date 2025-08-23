# Tech Context: Browser-based Snake Game (MVP)

## Technologies Used
- JavaScript (ES6 modules)
- HTML5 Canvas for rendering
- Basic CSS for layout and overlays

## Development Setup
- No build tooling required; plain ES modules loaded via <script type="module">
- Recommended local run: serve static files with any simple server, e.g.:
  - npx serve .
  - python3 -m http.server
- Organize code into modules: state, input, loop, logic/update, renderer
- Keep tick interval configurable (default 150 ms) via a constant or settings module

## Technical Constraints
- Static, front-end-only MVP (no backend)
- Framework-free; avoid external libraries unless strictly necessary
- Support the latest two major versions of Chrome, Firefox, Edge, Safari
- Deterministic update order: input → move → collisions/food → render
- Accessibility: keyboard operability, minimal ARIA on interactive elements

## Dependencies
- None required beyond browser APIs
- Optional dev dependency: a static file server for local development

## Persistence Decisions
- Leaderboard stored in browser localStorage under key `snake.leaderboard.v1`.
- Schema: array of entries `{ name: string, score: number, ts: epochMillis }`.
- Sorted by score desc, then timestamp asc; capped to top 10 entries.
- Input for name collected via prompt() on Game Over to avoid complex UI; default name "Player".

## Tool Usage Patterns
- Prefer pure functions for state transitions to improve predictability and testability
- Use a direction queue for input to avoid mid-tick mutations
- Use requestAnimationFrame only for render smoothness if needed; game logic governed by setInterval or a fixed-timestep loop (150 ms default)
- Keep rendering side-effects isolated; state and logic remain framework-agnostic
- Auto-pause/resume using document visibilitychange for better UX without complicating the loop
