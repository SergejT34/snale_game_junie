import { createRenderer } from './renderer.js';
import { createGame } from './loop.js';

import { addScore, renderLeaderboard, loadLeaderboard, getProvisionalRank, MAX_ENTRIES } from './leaderboard.js';
import { toggleMuted as toggleSoundMuted, isMuted as isSoundMuted, init as initAudio } from './audio.js';

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const overlayEl = document.getElementById('overlay');
const finalScoreEl = document.getElementById('final-score');
const finalTimeEl = document.getElementById('final-time');
const finalDifficultyEl = document.getElementById('final-difficulty');
const finalRankEl = document.getElementById('final-rank');
const restartBtn = document.getElementById('restart');
const difficultySel = document.getElementById('difficulty');
const leaderboardEl = document.getElementById('leaderboard');
const themeToggleBtn = document.getElementById('theme-toggle');
const soundToggleBtn = document.getElementById('sound-toggle');
const saveForm = document.getElementById('save-form');
const nameInput = document.getElementById('player-name');
const saveBtn = document.getElementById('save-score');

// ----- Theme management -----
const THEME_KEY = 'snake.theme.v1';
function getPreferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  // System preference fallback
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
function applyTheme(theme) {
  const t = (theme === 'dark' || theme === 'light') ? theme : 'light';
  document.documentElement.setAttribute('data-theme', t);
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-pressed', String(t === 'dark'));
    themeToggleBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggleBtn.title = 'Toggle theme';
  }
}
function initTheme() {
  const initial = getPreferredTheme();
  applyTheme(initial);
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch {}
    });
  }
  // Listen for system changes only if user has not set a preference
  if (!localStorage.getItem(THEME_KEY) && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
    if (mq.addEventListener) mq.addEventListener('change', handler); else mq.addListener(handler);
  }
}
initTheme();

// ----- Sound toggle -----
function applySoundButtonState() {
  if (!soundToggleBtn) return;
  const muted = isSoundMuted();
  soundToggleBtn.setAttribute('aria-pressed', String(!muted));
  soundToggleBtn.setAttribute('aria-label', muted ? 'Enable sound' : 'Disable sound');
  soundToggleBtn.title = 'Toggle sound';
  // Simple show/hide of icons via CSS classes; both SVGs present
  if (muted) {
    soundToggleBtn.classList.add('muted');
  } else {
    soundToggleBtn.classList.remove('muted');
  }
}

(function initSoundUI(){
  try { initAudio(); } catch {}
  applySoundButtonState();
  soundToggleBtn?.addEventListener('click', () => {
    toggleSoundMuted();
    applySoundButtonState();
  });
})();

// ----- Game setup -----
function getLastUsedName() {
  try {
    const entries = loadLeaderboard();
    if (!entries || !entries.length) return 'Player';
    let latest = entries[0];
    for (const e of entries) {
      if (typeof e?.ts === 'number' && e.ts > (latest?.ts ?? -Infinity)) {
        latest = e;
      }
    }
    const name = latest && typeof latest.name === 'string' && latest.name.trim() ? latest.name.trim() : 'Player';
    return name.slice(0, 20);
  } catch {
    return 'Player';
  }
}

function normalizeDifficulty(val) {
  const v = String(val ?? '').toLowerCase();
  return (v === 'easy' || v === 'medium' || v === 'hard') ? v : 'medium';
}

const renderer = createRenderer(canvas, scoreEl, overlayEl, finalScoreEl, finalTimeEl, finalDifficultyEl, finalRankEl);
let lastOnClick = null;
let lastOnKeyDown = null;
const game = createGame(renderer, {
  restartBtn,
  difficultySel,
  onGameOver: (score, durationMs) => {
    // Show provisional rank immediately before name entry
    if (finalRankEl) {
      try {
        const provRank = getProvisionalRank(score);
        if (Number.isFinite(provRank) && provRank > 0) {
          finalRankEl.textContent = `Rank: ${provRank <= MAX_ENTRIES ? '#' + provRank : '>' + MAX_ENTRIES}`;
        } else {
          finalRankEl.textContent = 'Rank: —';
        }
      } catch {
        finalRankEl.textContent = 'Rank: —';
      }
    }
    // Non-blocking UI: prefill input and let user save from overlay
    const defaultName = getLastUsedName();

    // Remove any lingering listeners from previous game over
    if (lastOnClick) saveBtn?.removeEventListener('click', lastOnClick);
    if (lastOnKeyDown) nameInput?.removeEventListener('keydown', lastOnKeyDown);

    if (nameInput) {
      nameInput.value = defaultName;
      try { nameInput.focus(); nameInput.select(); } catch {}
    }
    if (saveBtn) {
      saveBtn.disabled = false;
    }
    if (nameInput) nameInput.disabled = false;

    let saved = false;
    const difficulty = normalizeDifficulty(difficultySel?.value);

    function doSave() {
      if (saved) return;
      const ts = Date.now();
      const entered = (nameInput?.value ?? '').trim() || defaultName;
      const result = addScore(entered, score, difficulty, durationMs, ts);
      const entries = result?.entries || loadLeaderboard();
      const rank = result?.rank;
      if (finalRankEl) {
        if (Number.isFinite(rank) && rank > 0) {
          finalRankEl.textContent = `Rank: #${rank}`;
        } else {
          finalRankEl.textContent = 'Rank: —';
        }
      }
      renderLeaderboard(leaderboardEl, entries);
      saved = true;
      if (saveBtn) saveBtn.disabled = true;
      if (nameInput) nameInput.disabled = true;
    }

    // Attach one-time listeners for this game over
    const onClick = () => { doSave(); game.restart(); cleanup(); };
    const onKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); doSave(); game.restart(); cleanup(); } };

    function cleanup() {
      saveBtn?.removeEventListener('click', onClick);
      nameInput?.removeEventListener('keydown', onKeyDown);
      lastOnClick = null;
      lastOnKeyDown = null;
    }

    saveBtn?.addEventListener('click', onClick);
    nameInput?.addEventListener('keydown', onKeyDown);
    lastOnClick = onClick;
    lastOnKeyDown = onKeyDown;
  },
});

// Initial leaderboard render
renderLeaderboard(leaderboardEl, loadLeaderboard());

game.start();
