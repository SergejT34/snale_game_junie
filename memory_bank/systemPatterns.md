# System Patterns: Browser-based Snake Game (MVP)

## System Architecture
Layered ES6 module architecture with a clear separation of concerns:
- State Module: owns immutable-ish game state (grid size, snake body, direction queue, food position, score, status)
- Input Module: captures keyboard events, enqueues direction changes with reversal checks
- Update/Logic Module: processes one tick (dequeue input → move snake → collisions/food → state transitions)
- Renderer Module: draws state to HTML5 Canvas; updates score UI and overlays
- Loop Module: orchestrates the tick interval (default 150 ms), pause/resume, restart

## Key Technical Decisions
- Deterministic tick pipeline: input → move → collisions/food → render
- Configurable tick interval (150 ms default) to balance responsiveness and accessibility
- Framework-free, browser-native ES modules for simplicity and portability
- Auto-pause when the tab is hidden using document visibilitychange; resume when visible
- Food spawns only on empty cells; collisions include walls and self
- Restart resets all states without a page reload

## Design Patterns in Use
- Pure functions for state transitions where reasonable (given DOM constraints for rendering)
- Event queue pattern for input handling to avoid mid-tick direction changes
- Module boundary between logic (pure) and rendering (impure) to improve testability
- Single source of truth game state objects passed through the update pipeline

## Component Relationships
- Loop depends on Input, Update/Logic, and Renderer
- Input writes to a direction queue read by Update/Logic
- Update/Logic reads/writes State; signals pause/game-over to Loop
- Renderer reads State to draw Canvas, score, and overlays; does not mutate State

## Critical Implementation Paths
- Tick execution: dequeue input → compute next head → detect collision → apply growth/trim → place new food if needed → update score/status → render
- Collision detection: wall bounds check and O(1)/O(n) self-collision check (hash set recommended for O(1))
- Food placement: random selection among empty cells; retry or precompute an empty list
- Restart: reinitialize state (snake length 3 centered, one food) and resume loop
