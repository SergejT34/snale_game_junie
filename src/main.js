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

const renderer = createRenderer(canvas, scoreEl, overlayEl, finalScoreEl);
const game = createGame(renderer, {
  restartBtn,
  difficultySel,
  onGameOver: (score) => {
    // Prompt for name; default to Player when canceled/empty
    const name = window.prompt('New score! Enter your name:', 'Player');
    addScore(name ?? 'Player', score);
    renderLeaderboard(leaderboardEl, loadLeaderboard());
  },
});

// Initial leaderboard render
renderLeaderboard(leaderboardEl, loadLeaderboard());

game.start();
