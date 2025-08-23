# Progress: Browser-based Snake Game (MVP)

Last updated: 2025-08-23 19:03 (local)

## What Works
- Memory Bank with core project documentation (brief, product context, instructions, active context, system patterns, tech context)
- ES module-based Snake MVP implemented and runnable as static files
  - 20×20 grid, initial snake length 3, single food spawn
  - Deterministic loop at 150 ms default; update order: input → move → collisions/food → render
  - Keyboard controls (Arrow keys/WASD) with 180° reversal prevention
  - Wall/self collisions trigger Game Over overlay with Restart (no page reload)
  - Live, accessible score display (aria-live)
  - Difficulty levels: Easy (200 ms), Medium (150 ms), Hard (100 ms) selectable from UI; applies on start/restart
- Modular separation: state, input, logic, renderer, loop

## What's Left to Build
- Accessibility pass (validate ARIA and focus states thoroughly)
- Cross-browser verification (Chrome/Firefox/Edge/Safari, latest two versions)
- Optional polish: sounds, themes, mobile touch controls (out of MVP scope)

## Known Issues and Limitations
- No automated tests are defined
- Visual style minimal by design; no localization or persistence

## Evolution of Project Decisions
- Confirmed framework-free, static approach to keep MVP simple and portable
- Adopted deterministic update pipeline and input queue for predictability
- Emphasized separation of logic and rendering to enable future testing and maintenance
- Added pause on tab hidden via visibilitychange for better UX
- Introduced difficulty levels with state-backed tick interval; selection restart applies new speed
