// Renderer module: draws to canvas and updates UI
import { GRID_SIZE } from './state.js';

export function createRenderer(canvas, scoreEl, overlayEl, finalScoreEl) {
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
    const bodyColor = cssVar('--snake-body', '#36c275');
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
    ctx.fillStyle = cssVar('--food', '#ff6b6b');
    ctx.beginPath();
    const cx = food.x * size + size / 2;
    const cy = food.y * size + size / 2;
    const r = Math.floor(size * 0.3);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(state) {
    clear();
    drawGrid();
    drawFood(state.food);
    drawSnake(state.snake);

    // Update score UI
    if (scoreEl) scoreEl.textContent = `Score: ${state.score}`;

    // Overlay
    if (overlayEl && finalScoreEl) {
      if (state.status === 'over') {
        overlayEl.classList.add('show');
        overlayEl.setAttribute('aria-hidden', 'false');
        finalScoreEl.textContent = `Score: ${state.score}`;
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
