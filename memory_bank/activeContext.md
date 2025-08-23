# Active Context: Browser-based Snake Game (MVP)

Last updated: 2025-08-23 18:58 (local)

## Current Work Focus
Implement and verify the playable Snake MVP per documented scope; ensure accessibility basics and restart flow.

## Recent Changes
- Implemented ES module-based Snake game (state, input, logic, renderer, loop)
- Added index.html and styles.css with accessible UI (aria-live score, overlay dialog, restart button)
- Implemented deterministic loop (150 ms default), reversal prevention, collisions, scoring, and restart

## Next Steps
- Manual cross-browser verification (latest Chrome/Firefox/Edge/Safari)
- Accessibility pass: keyboard focus order and ARIA roles review
- Document run instructions and any findings in progress.md

## Active Decisions and Considerations
- Use ES6 modules; separate game logic, state, input, loop, and rendering
- Deterministic update order per tick: input → move → collisions/food → render
- Default tick interval 150 ms, configurable
- Accessibility: keyboard operable UI with minimal ARIA
- Keep the MVP framework-free and static (no build step)

## Important Patterns and Preferences
- Pure functions for state transitions where feasible
- Single source of truth for game state; render is a pure projection of state
- Input events are queued and applied on tick to preserve determinism

## Learnings and Project Insights
- Visibility change pause improves UX without complicating the architecture.
