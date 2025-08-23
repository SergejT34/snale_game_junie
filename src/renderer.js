// Renderer module: draws to canvas and updates UI
import { GRID_SIZE } from './state.js';
import { getProvisionalRank, MAX_ENTRIES } from './leaderboard.js';

export function createRenderer(canvas, scoreEl, overlayEl, finalScoreEl, finalTimeEl, finalDifficultyEl, finalRankEl) {
  const ctx = canvas.getContext('2d');

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
    ctx.fillStyle = cssVar('--food', '#ff7f0e');
    ctx.beginPath();
    const cx = food.x * size + size / 2;
    const cy = food.y * size + size / 2;
    const r = Math.floor(size * 0.3);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
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

    // Update score UI with live provisional rank compared to leaderboard
    if (scoreEl) {
      let rankText = '';
      try {
        const rank = getProvisionalRank(state.score);
        if (Number.isFinite(rank) && rank > 0) {
          rankText = ` · Rank: ${rank <= MAX_ENTRIES ? '#' + rank : '>' + MAX_ENTRIES}`;
        }
      } catch {}
      scoreEl.textContent = `Score: ${state.score}${rankText}`;
    }

    // Overlay
    if (overlayEl && finalScoreEl) {
      if (state.status === 'over') {
        // Detect transition from hidden -> shown to run one-time side effects (like focusing input)
        const wasHidden = overlayEl.getAttribute('aria-hidden') !== 'false';
        overlayEl.classList.add('show');
        overlayEl.setAttribute('aria-hidden', 'false');
        finalScoreEl.textContent = `Score: ${state.score}`;
        if (finalTimeEl) {
          const duration = Math.max(0, Date.now() - (state.startedAt || Date.now()));
          finalTimeEl.textContent = `Time: ${formatDuration(duration)}`;
        }
        if (finalDifficultyEl) {
          finalDifficultyEl.textContent = `Difficulty: ${labelDifficulty(state.difficulty)}`;
        }
        // Ensure player's name input is focused every time overlay opens
        if (wasHidden) {
          const input = document.getElementById('player-name');
          if (input && typeof input.focus === 'function') {
            // Delay focus to after DOM/class changes apply for consistent behavior across browsers
            setTimeout(() => {
              try { input.focus({ preventScroll: true }); if (typeof input.select === 'function') input.select(); } catch {}
            }, 0);
          }
        }
      } else {
        overlayEl.classList.remove('show');
        overlayEl.setAttribute('aria-hidden', 'true');
      }
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
