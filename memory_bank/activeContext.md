# Active Context: Browser-based Snake Game (MVP)

Last updated: 2025-08-23 20:06 (local)

## Current Work Focus
Add Light and Dark themes with an accessible header toggle and persist user choice; keep rendering in sync with theme via CSS variables.

## Recent Changes
- Implemented ES module-based Snake game (state, input, logic, renderer, loop)
- Added index.html and styles.css with accessible UI (aria-live score, overlay dialog, restart button)
- Implemented deterministic loop (150 ms default), reversal prevention, collisions, scoring, and restart
- Added difficulty selector (Easy/Medium/Hard) in the top bar; the game restarts on change to apply speed
- Leaderboard now stores and displays the difficulty for each score entry (backward compatible with existing entries)
- Leaderboard also tracks and displays time spent per game (mm:ss) for each entry; stored as durationMs alongside existing fields (backward compatible).
- Accessibility: Restart can be triggered via Space or Enter when the Game Over overlay is visible (global shortcut).
- New: Light/Dark theme support via CSS variables; theme toggle button added to header; preference stored in localStorage and respects system preference on first load.

## Next Steps (Prioritized Checklist)
1) Cross-browser verification (latest two versions of Chrome, Firefox, Edge, Safari)
   - Launch via a static server (e.g., `npx serve .`), play a full round per browser
   - Confirm: controls, reversal prevention, collisions, overlay, restart, difficulty speeds, no console errors
   - Verify theme toggle behavior and persistence; check canvas colors match theme
2) Accessibility pass (keyboard and ARIA)
   - Tab order: header → difficulty → theme toggle → score → canvas → overlay controls when shown
   - Ensure overlay "dialog" traps focus when visible and returns focus to Restart after closing
   - Validate aria-live regions (score, leaderboard) do not spam; labels present on interactive elements
3) Usability/polish (MVP-safe)
   - Ensure canvas resizes responsively; verify devicePixelRatio logic on HiDPI
   - Tweak focus styles for visible focus on all controls
   - Confirm visibilitychange pause/resume works reliably
4) Documentation updates
   - Add “How to run locally” and “Browser support notes” to progress.md
   - Record cross-browser, a11y, and theming findings; create a short checklist for regressions

## Active Decisions and Considerations
- Use ES6 modules; separate game logic, state, input, loop, and rendering
- Deterministic update order per tick: input → move → collisions/food → render
- Default tick interval 150 ms, configurable
- Difficulty speeds: easy=200 ms, medium=150 ms, hard=100 ms; reflected in state for transparency
- Accessibility: keyboard-operable UI with minimal ARIA
- Keep the MVP framework-free and static (no build step)
- Theme architecture: CSS custom properties with html[data-theme] switch; renderer uses CSS variables for canvas drawing

## Important Patterns and Preferences
- Pure functions for state transitions where feasible
- Single source of truth for game state; render is a pure projection of state
- Input events are queued and applied on tick to preserve determinism

## Learning and Project Insights
- Visibility change pause improves UX without complicating the architecture.
