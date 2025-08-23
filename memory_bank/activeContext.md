# Active Context: Browser-based Snake Game (MVP)

Last updated: 2025-08-23 19:59 (local)

## Current Work Focus
Implement and verify the playable Snake MVP per documented scope; ensure accessibility basics and restart flow. Add difficulty levels with distinct speeds.

## Recent Changes
- Implemented ES module-based Snake game (state, input, logic, renderer, loop)
- Added index.html and styles.css with accessible UI (aria-live score, overlay dialog, restart button)
- Implemented deterministic loop (150 ms default), reversal prevention, collisions, scoring, and restart
- Added difficulty selector (Easy/Medium/Hard) in the top bar; the game restarts on change to apply speed
- Leaderboard now stores and displays the difficulty for each score entry (backward compatible with existing entries)
- Accessibility: Restart can be triggered via Space or Enter when the Game Over overlay is visible (global shortcut).

## Next Steps (Prioritized Checklist)
1) Cross-browser verification (latest two versions of Chrome, Firefox, Edge, Safari)
   - Launch via a static server (e.g., `npx serve .`), play a full round per browser
   - Confirm: controls, reversal prevention, collisions, overlay, restart, difficulty speeds, no console errors
   - Note any rendering differences (canvas crispness/DPR) and file them in progress.md
2) Accessibility pass (keyboard and ARIA)
   - Tab order: header → difficulty → score → canvas → overlay controls when shown
   - Ensure overlay "dialog" traps focus when visible and returns focus to Restart after closing
   - Validate aria-live regions (score, leaderboard) do not spam; labels present on interactive elements
3) Usability/polish (MVP-safe)
   - Ensure canvas resizes responsively; verify devicePixelRatio logic on HiDPI
   - Tweak focus styles for visible focus on all controls
   - Confirm visibilitychange pause/resume works reliably
4) Documentation updates
   - Add “How to run locally” and “Browser support notes” to progress.md
   - Record cross-browser and a11y findings; create a short checklist for regressions
5) Optional stretch (post-MVP)
   - Touch controls for mobile, sound toggle, basic theme switch (remain out-of-scope for MVP)

## Active Decisions and Considerations
- Use ES6 modules; separate game logic, state, input, loop, and rendering
- Deterministic update order per tick: input → move → collisions/food → render
- Default tick interval 150 ms, configurable
- Difficulty speeds: easy=200 ms, medium=150 ms, hard=100 ms; reflected in state for transparency
- Accessibility: keyboard-operable UI with minimal ARIA
- Keep the MVP framework-free and static (no build step)

## Important Patterns and Preferences
- Pure functions for state transitions where feasible
- Single source of truth for game state; render is a pure projection of state
- Input events are queued and applied on tick to preserve determinism

## Learning and Project Insights
- Visibility change pause improves UX without complicating the architecture.
