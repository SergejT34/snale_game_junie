// Logic module: one-tick update pipeline
import { key, placeFood } from './state.js';

export function step(state) {
  if (state.status !== 'running') return state;

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
  const willEat = state.food && next.x === state.food.x && next.y === state.food.y;

  // 4) Collisions: self (allow moving into tail if tail will move this tick when not eating)
  const tail = state.snake[0];
  const tailKey = key(tail.x, tail.y);
  const collidesWithSelf = state.occupied.has(nextKey) && (!willEat && nextKey !== tailKey);
  if (collidesWithSelf) {
    state.status = 'over';
    return state;
  }

  // 5) Apply movement
  state.snake.push(next);
  state.occupied.add(nextKey);

  if (willEat) {
    state.score += 1;
    state.food = placeFood(state.occupied);
  } else {
    // trim tail
    const removed = state.snake.shift();
    state.occupied.delete(key(removed.x, removed.y));
  }

  return state;
}
