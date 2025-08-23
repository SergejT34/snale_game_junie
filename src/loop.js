// Loop module: orchestrates ticking and restart
import { createInitialState, DIFFICULTY_SPEEDS, DEFAULT_DIFFICULTY } from './state.js';
import { step } from './logic.js';
import { bindInput } from './input.js';
import { playFood, playDeath, playStart, init as initAudio } from './audio.js';

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

  initAudio();

  let lastStatus = state.status;
  let lastScore = state.score;
  function tick() {
    const beforeScore = state.score;
    step(state);
    if (state.score > beforeScore) {
      // Ate food this tick
      try { playFood(); } catch {}
    }
    renderer.render(state);
    if (state.status === 'over' && lastStatus !== 'over') {
      try { playDeath(); } catch {}
      const durationMs = Math.max(0, Date.now() - (state.startedAt || Date.now()));
      dom?.onGameOver?.(state.score, durationMs);
    }
    lastStatus = state.status;
    lastScore = state.score;
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
    try { playStart(); } catch {}
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
    try { playStart(); } catch {}
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
    // Restart only if the game is running or over to apply speed; preserves UX simplicity
    restart();
    dom.difficultySel.focus();
  });

  window.addEventListener('resize', () => {
    renderer.resizeToDisplaySize();
    renderer.render(state);
  });

  return { start, stop, restart };
}
