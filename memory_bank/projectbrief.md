# Project Brief: Browser-based Snake Game (MVP)

## Overview
A minimal, fully playable Snake game that runs in modern browsers using ES6 modules and HTML5 Canvas. The MVP focuses on essential gameplay: movement on a 20×20 grid, food consumption and growth, collision-based game over, live score, and restart — all keyboard-operable and accessible.

## Core Requirements
- 20×20 grid with snake length 3 at the start and one food item spawned in an empty cell
- A non-food “shrinker” emoji item can spawn on the grid at random times. Eating it shrinks the snake by 1 and decreases score by 1 (score does not go below 0). It is placed on an empty cell, never overlapping the snake or the food. After a normal food is eaten, any existing shrinker disappears at the boundary before the next tick (i.e., after the new food is spawned, between ticks). It can appear multiple times during a run; when absent, each tick has a chance to spawn one (it will not immediately reappear on the exact tick a food item was eaten, and spawn is also skipped on the tick when the deferred disappearance occurs).
- Deterministic core game loop at a configurable tick interval (150 ms default)
- Update order per tick: input → move → collisions/food → render
- Keyboard controls (Arrow keys and/or WASD) with prevention of 180° reversals
- Collision handling: wall or self-collision triggers Game Over
- Live score display that updates as food is eaten
- Game Over overlay with the final score and a Restart button
- Restart returns to the initial state without a page reload
- Accessibility: fully keyboard-operable UI; the minimal, appropriate ARIA on interactive elements
- Browser support: latest two major versions of Chrome, Firefox, Edge, Safari

## Goals
- Deliver a responsive, smooth-playing browser Snake MVP without build tooling
- Keep logic modular and rendering separated for clarity and maintainability
- Ensure accessibility basics and cross-browser compatibility are satisfied

## Project Scope
In Scope:
- ES6 module-based front-end implementation with HTML5 Canvas rendering
- Core gameplay features and flows defined in MVP specs
- Minimal UI elements: canvas, score display, Game Over overlay, Restart button
- Documentation in memory_bank/ reflecting product/tech context, patterns, progress, and active context

Out of Scope (for MVP):
- Sound effects, themes/skins, animations beyond essentials
- Mobile touch controls (optional later), high-DPI sprite assets, localization
- Leaderboards, persistence, or backend services
- Complex accessibility features beyond minimal ARIA and keyboard operability
