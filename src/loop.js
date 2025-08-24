// Loop module: orchestrates ticking and restart
import { createInitialState, DIFFICULTY_SPEEDS, DEFAULT_DIFFICULTY } from './state.js';
import { step } from './logic.js';
import { bindInput } from './input.js';
import { playFood, playDeath, playStart, init as initAudio, startMusic, stopMusic } from './audio.js';

export function createGame(renderer, dom) {
  function currentDifficulty() {
    const sel = dom?.difficultySel;
    const val = sel?.value || DEFAULT_DIFFICULTY;
    return (val in DIFFICULTY_SPEEDS) ? val : DEFAULT_DIFFICULTY;
  }
  function currentTickMs() {
    return DIFFICULTY_SPEEDS[currentDifficulty()];
  }
  function currentMusicBpm() {
    const d = currentDifficulty();
    if (d === 'easy') return 110;
    if (d === 'hard') return 170;
    return 140; // medium
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
    try { startMusic(currentMusicBpm()); } catch {}
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    try { stopMusic(); } catch {}
  }

  function restart() {
    stop();
    cleanupInput?.();
    state = createInitialState({ tickMs: currentTickMs(), difficulty: currentDifficulty() });
    cleanupInput = bindInput(state);
    renderer.render(state);
    intervalId = window.setInterval(tick, state.tickMs);
    try { playStart(); } catch {}
    try { startMusic(currentMusicBpm()); } catch {}
  }

  // handle focus/visibility for pause/resume (optional)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stop();
    } else if (state.status === 'running' && intervalId === null) {
      intervalId = window.setInterval(tick, state.tickMs);
      try { startMusic(currentMusicBpm()); } catch {}
    }
  });

  // Restart button
  dom.restartBtn?.addEventListener('click', () => {
    restart();
    dom.restartBtn.focus();
  });


  // Apply new difficulty:
  // - If running: restart immediately to apply speed/music tempo
  // - If over or before first start: do not auto-start; selection applies on next start/restart
  dom.difficultySel?.addEventListener('change', () => {
    if (state.status === 'running') {
      restart();
    }
    dom.difficultySel.focus();
  });

  window.addEventListener('resize', () => {
    renderer.resizeToDisplaySize();
    renderer.render(state);
  });

  return { start, stop, restart };
}
