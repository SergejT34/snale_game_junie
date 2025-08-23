# Product Context: Browser-based Snake Game (MVP)

## Problem Statement
We need a lightweight, framework-free, browser-playable Snake game that demonstrates clear modular architecture and can be run as static files. It should provide a complete gameplay loop with minimal features, be easy to understand/extend, and work reliably across modern browsers without a build step.

## User Experience Goals
- Immediate, responsive controls using keyboard (Arrow keys and/or WASD); prevent accidental 180° reversals
- Clear visual feedback: grid-based movement, distinct snake and food colors, legible live score
- Smooth, consistent gameplay at ~150 ms tick interval with predictable behavior
- Accessible basics: fully keyboard operable UI, minimal and appropriate ARIA labels for interactive elements (e.g., Restart)
- Frictionless restart: reset the game state without reloading the page; clear Game Over overlay with final score
- Canvas scales to viewport while preserving aspect ratio and readability

## Success Metrics
- Functional acceptance:
  - Player can control the snake; 180° reversals are blocked
  - Snake grows upon eating food; score increments correctly
  - Colliding with wall or self triggers immediate Game Over overlay with final score
  - Restart restores initial state and gameplay proceeds normally
- Technical acceptance:
  - Works in latest two major versions of Chrome, Firefox, Edge, Safari
  - No console errors during normal play
  - Deterministic update order: input → move → collisions/food → render at default 150 ms (configurable)
- Accessibility acceptance:
  - All interactive elements reachable via keyboard
  - Minimal ARIA set on interactive UI where relevant
