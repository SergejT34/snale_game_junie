import { createRenderer } from './renderer.js';
import { createGame } from './loop.js';

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const overlayEl = document.getElementById('overlay');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart');

const renderer = createRenderer(canvas, scoreEl, overlayEl, finalScoreEl);
const game = createGame(renderer, { restartBtn });

game.start();
