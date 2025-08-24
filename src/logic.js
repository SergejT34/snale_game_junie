// Logic module: one-tick update pipeline
import { key, placeFood, placeShrinker, HAZARD_SPAWN_CHANCE } from './state.js';

export function step(state) {
  if (state.status !== 'running') return state;

  // Reset transient FX flags
  state.fxEatFood = false;
  state.fxEatShrinker = false;

  // 0) Deferred hazard clear between ticks (after food spawn on previous tick)
  let clearedThisTick = false;
  if (state.pendingShrinkerClear) {
    state.shrinker = null;
    state.pendingShrinkerClear = false;
    clearedThisTick = true;
  }

  // 1) Apply queued input (use only first this tick)
  if (state.dirQueue.length) {
    state.dir = state.dirQueue.shift();
    state.dirQueue.length = 0; // consume all inputs this tick for determinism
  }

  // 2) Move snake: compute next head
  const head = state.snake[state.snake.length - 1];
  const next = { x: head.x + state.dir.x, y: head.y + state.dir.y };

  // 3) Collisions: walls
  if (next.x < 0 || next.y < 0 || next.x >= state.grid || next.y >= state.grid) {
    state.status = 'over';
    return state;
  }

  const nextKey = key(next.x, next.y);
  const willEatFood = state.food && next.x === state.food.x && next.y === state.food.y;
  const willEatShrinker = state.shrinker && next.x === state.shrinker.x && next.y === state.shrinker.y;

  // 4) Collisions: self (allow moving into tail if tail moves this tick when not eating food)
  // Moving into tail is allowed when not eating normal food (tail will move). It is also fine when hitting a shrinker
  // because we will trim at least one tail segment this tick.
  const tail = state.snake[0];
  const tailKey = key(tail.x, tail.y);
  const collidesWithSelf = state.occupied.has(nextKey) && (!willEatFood && nextKey !== tailKey);
  if (collidesWithSelf) {
    state.status = 'over';
    return state;
  }

  // 5) Apply movement
  state.snake.push(next);
  state.occupied.add(nextKey);

  if (willEatFood) {
    state.score += 1;
    state.fxEatFood = true;
    // Place new food; ensure it does not overlap the shrinker
    let nf = placeFood(state.occupied);
    if (nf && state.shrinker && nf.x === state.shrinker.x && nf.y === state.shrinker.y) {
      nf = placeFood(state.occupied);
    }
    state.food = nf;
    // Defer hazard disappearance: mark to clear at the start of next tick (between ticks)
    state.pendingShrinkerClear = true;
  } else {
    // trim tail
    const removed = state.snake.shift();
    state.occupied.delete(key(removed.x, removed.y));

    // If we hit a shrinker, remove one extra segment (shrink by 1 net compared to previous length)
    if (willEatShrinker) {
      // Score decreases when eating a non-eatable item (clamped to 0)
      state.score = Math.max(0, state.score - 1);
      state.fxEatShrinker = true;
      // Respawn shrinker probabilistically; avoid overlapping with food
      let ns = null;
      if (Math.random() < HAZARD_SPAWN_CHANCE) {
        ns = placeShrinker(state.occupied, state.food);
      }
      state.shrinker = ns;

      if (state.snake.length > 0) {
        const removed2 = state.snake.shift();
        state.occupied.delete(key(removed2.x, removed2.y));
      }
      // If snake somehow becomes empty (shouldn't with initial length 3), game over
      if (state.snake.length === 0) {
        state.status = 'over';
        return state;
      }
    }
  }

  // 6) Periodic hazard spawn: if absent, try to spawn probabilistically this tick
  //    Do not immediately respawn on the same tick we ate normal food, and also skip spawn on the tick we clear it between ticks
  if (!state.shrinker && !willEatFood && !clearedThisTick && Math.random() < HAZARD_SPAWN_CHANCE) {
    state.shrinker = placeShrinker(state.occupied, state.food);
  }

  return state;
}
