import { createRenderer } from './renderer.js';
import { createGame } from './loop.js';

import { addScore, renderLeaderboard, loadLeaderboard } from './leaderboard.js';

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const overlayEl = document.getElementById('overlay');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart');
const difficultySel = document.getElementById('difficulty');
const leaderboardEl = document.getElementById('leaderboard');
const themeToggleBtn = document.getElementById('theme-toggle');

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

const renderer = createRenderer(canvas, scoreEl, overlayEl, finalScoreEl);
const game = createGame(renderer, {
  restartBtn,
  difficultySel,
  onGameOver: (score, durationMs) => {
    // Prompt for name; default to last used if exists, otherwise Player
    const defaultName = getLastUsedName();
    const name = window.prompt('New score! Enter your name:', defaultName);
    const difficulty = normalizeDifficulty(difficultySel?.value);
    addScore(name ?? defaultName, score, difficulty, durationMs);
    renderLeaderboard(leaderboardEl, loadLeaderboard());
  },
});

// Initial leaderboard render
renderLeaderboard(leaderboardEl, loadLeaderboard());

game.start();
