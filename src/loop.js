// Loop module: orchestrates ticking and restart
import { createInitialState } from './state.js';
import { step } from './logic.js';
import { bindInput } from './input.js';

export function createGame(renderer, dom) {
  let state = createInitialState();
  let cleanupInput = bindInput(state);
  let intervalId = null;

  function tick() {
    step(state);
    renderer.render(state);
    if (state.status === 'over') stop();
  }

  function start() {
    stop();
    renderer.resizeToDisplaySize();
    intervalId = window.setInterval(tick, state.tickMs);
    renderer.render(state);
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function restart() {
    stop();
    cleanupInput?.();
    state = createInitialState();
    cleanupInput = bindInput(state);
    renderer.render(state);
    intervalId = window.setInterval(tick, state.tickMs);
  }

  // handle focus/visibility for pause/resume (optional)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stop();
    } else if (state.status === 'running' && intervalId === null) {
      intervalId = window.setInterval(tick, state.tickMs);
    }
  });

  // Restart button
  dom.restartBtn?.addEventListener('click', () => {
    restart();
    dom.restartBtn.focus();
  });

  window.addEventListener('resize', () => {
    renderer.resizeToDisplaySize();
    renderer.render(state);
  });

  return { start, stop, restart };
}
