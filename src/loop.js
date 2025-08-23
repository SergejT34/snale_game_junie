// Loop module: orchestrates ticking and restart
import { createInitialState, DIFFICULTY_SPEEDS, DEFAULT_DIFFICULTY } from './state.js';
import { step } from './logic.js';
import { bindInput } from './input.js';

export function createGame(renderer, dom) {
  function currentDifficulty() {
    const sel = dom?.difficultySel;
    const val = sel?.value || DEFAULT_DIFFICULTY;
    return (val in DIFFICULTY_SPEEDS) ? val : DEFAULT_DIFFICULTY;
  }
  function currentTickMs() {
    return DIFFICULTY_SPEEDS[currentDifficulty()];
  }

  let state = createInitialState({ tickMs: currentTickMs(), difficulty: currentDifficulty() });
  let cleanupInput = bindInput(state);
  let intervalId = null;

  function tick() {
    step(state);
    renderer.render(state);
    if (state.status === 'over') stop();
  }

  function start() {
    stop();
    // ensure state reflects current selection
    state.tickMs = currentTickMs();
    state.difficulty = currentDifficulty();
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
    state = createInitialState({ tickMs: currentTickMs(), difficulty: currentDifficulty() });
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

  // Apply new difficulty immediately by restarting
  dom.difficultySel?.addEventListener('change', () => {
    // Restart only if game is running or over to apply speed; preserves UX simplicity
    restart();
    dom.difficultySel.focus();
  });

  window.addEventListener('resize', () => {
    renderer.resizeToDisplaySize();
    renderer.render(state);
  });

  return { start, stop, restart };
}
