# Project Guidelines

## Project Overview
This repository contains documentation and planning for a Browser-based Snake Game (MVP). The goal is to deliver a minimal, fully playable Snake game that runs in modern browsers using ES6 modules and HTML5 Canvas. The MVP includes:
- 20×20 grid, snake length 3 at start, one food item
- Core game loop (~150 ms default) handling input → move → collisions/food → render
- Keyboard controls (Arrow keys and/or WASD), preventing 180° reversals
- Live score display, Game Over overlay, and Restart without page reload
- Accessibility considerations (keyboard operability, minimal ARIA)
- Support the latest two major versions of Chrome, Firefox, Edge, Safari

For detailed specs see: memory_bank/projectbrief.md and snake_game.md.

## Repository Structure
- memory_bank/: Living documentation for the project (brief, product/tech context, patterns, progress, active context, instructions)
- snake_game.md: Consolidated MVP specification and acceptance criteria
- .junie/: Junie configuration and these guidelines

## Development & Run
- This is a static, front-end-only MVP. No backend or build step is required for the core game.
- Recommended local run: serve static files via any simple server (e.g., `npx serve .`).
- Organize code (when added) into ES6 modules separating game logic, state, input, loop, and rendering.

## Tests & Build
- No tests are defined in this repository at present.
- No build tooling is required for the MVP; plain ES modules in the browser are enough.

## Code Style & Conventions
- Use ES6+ modules with clear imports/exports.
- Keep rendering concerns separate from state/logic; prefer pure functions for state transitions.
- Maintain a deterministic update order: input → move → collision/food → render.
- Keep the tick interval configurable (default 150 ms).

## How Junie Should Work Here
- Make minimal changes necessary to satisfy the issue descriptions.
- Update documentation in memory_bank when changing scope, tech, or decisions.
- If adding code, prefer modular structure and keep it framework-free unless explicitly required.
- If tests are introduced in the future, document how to run them here.
