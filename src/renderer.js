// Renderer module: draws to canvas and updates UI
import { GRID_SIZE } from './state.js';
import { getProvisionalRank, MAX_ENTRIES, getTopByDifficulty } from './leaderboard.js';

export function createRenderer(canvas, scoreEl, overlayEl, finalScoreEl, finalTimeEl, finalDifficultyEl, finalRankEl) {
  const ctx = canvas.getContext('2d');
  // Track last shown provisional rank to trigger UI effects on change
  let lastRankShown = null;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function clear() {
    ctx.fillStyle = cssVar('--canvas-bg', '#0b0c10');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function cellSize() {
    return Math.floor(Math.min(canvas.width, canvas.height) / GRID_SIZE);
  }

  function drawGrid() {
    const size = cellSize();
    ctx.strokeStyle = cssVar('--grid-line', '#141720');
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const p = i * size + 0.5;
      ctx.beginPath();
      ctx.moveTo(0.5, p);
      ctx.lineTo(GRID_SIZE * size + 0.5, p);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p, 0.5);
      ctx.lineTo(p, GRID_SIZE * size + 0.5);
      ctx.stroke();
    }
  }

  function drawSnake(snake) {
    const size = cellSize();
    const headColor = cssVar('--snake-head', '#3a7afe');
    const bodyColor = cssVar('--snake-body', '#9467bd');
    for (let i = 0; i < snake.length; i++) {
      const { x, y } = snake[i];
      const isHead = i === snake.length - 1;
      ctx.fillStyle = isHead ? headColor : bodyColor;
      ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
    }
  }

  function drawFood(food) {
    if (!food) return;
    const size = cellSize();
    const cx = food.x * size + size / 2;
    const cy = food.y * size + size / 2;
    const emoji = food.emoji;
    if (emoji && typeof emoji === 'string') {
      // Render emoji centered in the cell; scale relative to cell size
      const fontSize = Math.floor(size * 0.8);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif`;
      ctx.fillText(emoji, cx, cy + Math.floor(size * 0.02)); // tiny vertical tweak
      ctx.restore();
    } else {
      // Fallback to circle if no emoji provided
      ctx.fillStyle = cssVar('--food', '#ff7f0e');
      ctx.beginPath();
      const r = Math.floor(size * 0.3);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function labelDifficulty(val) {
    const map = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    return map[val] || 'Medium';
  }

  function formatDuration(ms) {
    const n = Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;
    const totalSec = Math.floor(n / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const mm = String(min);
    const ss = String(sec).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function render(state) {
    clear();
    drawGrid();
    drawFood(state.food);
    drawSnake(state.snake);

    // Update score UI with live provisional rank compared to leaderboard, plus player name and difficulty
    if (scoreEl) {
      const playerNameInput = document.getElementById('player-name');
      const playerName = (playerNameInput?.value ?? '').trim() || 'Player';
      const diffLabel = labelDifficulty(state.difficulty);

      let rankText = '';
      let holderText = '';
      let currentRank = null;
      try {
        const rank = getProvisionalRank(state.score, state.difficulty);
        if (Number.isFinite(rank) && rank > 0) {
          currentRank = rank;
          rankText = `Rank: ${rank <= MAX_ENTRIES ? '#' + rank : '>' + MAX_ENTRIES}`;
          // Determine current holder of that rank for the selected difficulty
          const entries = getTopByDifficulty(state.difficulty) || [];
          const holderNameRaw = entries[rank - 1]?.name;
          if (holderNameRaw) {
            const same = holderNameRaw.trim().toLowerCase() === playerName.toLowerCase();
            holderText = ` — ${same ? 'You' : holderNameRaw}`;
          }
        }
      } catch {}
      scoreEl.textContent = `${playerName} · Score: ${state.score} · ${rankText}${holderText} (${diffLabel})`;
      // If rank changed (including from null to a number), trigger a brief shake animation
      if (currentRank !== lastRankShown) {
        lastRankShown = currentRank;
        scoreEl.classList.remove('shake');
        // Force reflow to restart animation
        // eslint-disable-next-line no-unused-expressions
        void scoreEl.offsetWidth;
        scoreEl.classList.add('shake');
        // Remove the class after animation ends to allow future re-triggers
        setTimeout(() => scoreEl.classList.remove('shake'), 500);
      }
    }

    // Overlay behavior: do NOT show any Game Over screen.
    // Keep the overlay hidden during gameplay and after game over; it is only used for the initial welcome/start.
    if (overlayEl && finalScoreEl) {
      // Always hide during gameplay
      if (state.status !== 'over') {
        overlayEl.classList.remove('show');
        overlayEl.setAttribute('aria-hidden', 'true');
      }
      // When over, do nothing special: overlay remains hidden; no stats are shown.
    }
  }

  // Make a canvas backing store match its CSS size for crisp drawing
  function resizeToDisplaySize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  return { render, resizeToDisplaySize };
}
