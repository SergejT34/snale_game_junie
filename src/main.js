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
  onGameOver: (score) => {
    // Prompt for name; default to last used if exists, otherwise Player
    const defaultName = getLastUsedName();
    const name = window.prompt('New score! Enter your name:', defaultName);
    const difficulty = normalizeDifficulty(difficultySel?.value);
    addScore(name ?? defaultName, score, difficulty);
    renderLeaderboard(leaderboardEl, loadLeaderboard());
  },
});

// Initial leaderboard render
renderLeaderboard(leaderboardEl, loadLeaderboard());

game.start();
