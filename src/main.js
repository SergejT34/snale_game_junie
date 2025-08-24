import { createRenderer } from './renderer.js';
import { createGame } from './loop.js';

import { addScore, renderLeaderboard, loadLeaderboard, getProvisionalRank, MAX_ENTRIES, getTopByDifficulty } from './leaderboard.js';
import { toggleMuted as toggleSoundMuted, isMuted as isSoundMuted, init as initAudio } from './audio.js';

const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const startOverlayEl = document.getElementById('start-overlay');
const playBtn = document.getElementById('play-btn');
const overlayEl = startOverlayEl;
const finalScoreEl = document.getElementById('final-score');
const finalTimeEl = document.getElementById('final-time');
const finalDifficultyEl = document.getElementById('final-difficulty');
const finalRankEl = document.getElementById('final-rank');
const restartBtn = document.getElementById('restart');
const difficultyGroup = document.getElementById('difficulty-group');

// Difficulty control shim to mimic select API (value + change events)
function createDifficultyControl(groupEl, initial = 'medium') {
  const btns = Array.from(groupEl?.querySelectorAll('button[data-difficulty]') || []);
  const valid = new Set(['easy', 'medium', 'hard']);
  let current = valid.has(initial) ? initial : 'medium';
  const listeners = new Set();

  function setPressed(val) {
    btns.forEach(btn => {
      const v = btn.getAttribute('data-difficulty');
      const pressed = v === val;
      btn.setAttribute('aria-pressed', String(pressed));
      // simple selected class for styling if needed
      if (pressed) btn.classList.add('selected'); else btn.classList.remove('selected');
    });
  }

  function emitChange() {
    listeners.forEach(fn => {
      try { fn({ type: 'change' }); } catch {}
    });
  }

  function setValue(v, { silent } = {}) {
    const nv = String(v || '').toLowerCase();
    if (!valid.has(nv)) return;
    if (nv === current) return;
    current = nv;
    setPressed(current);
    if (!silent) emitChange();
  }

  // init pressed state
  setPressed(current);

  // clicks update value
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-difficulty');
      setValue(v);
    });
  });

  return {
    get value() { return current; },
    set value(v) { setValue(v); },
    addEventListener(type, fn) { if (type === 'change' && typeof fn === 'function') listeners.add(fn); },
    removeEventListener(type, fn) { if (type === 'change') listeners.delete(fn); },
    focus() {
      const active = groupEl?.querySelector('button[aria-pressed="true"]');
      if (active) active.focus(); else groupEl?.focus?.();
    },
    // For completeness, allow programmatic init without firing change
    _init(v) { setValue(v, { silent: true }); }
  };
}

const difficultySel = difficultyGroup ? createDifficultyControl(difficultyGroup, 'medium') : document.getElementById('difficulty');
const leaderboardEasyEl = document.getElementById('leaderboard-easy');
const leaderboardMediumEl = document.getElementById('leaderboard-medium');
const leaderboardHardEl = document.getElementById('leaderboard-hard');
const themeToggleBtn = document.getElementById('theme-toggle');
const soundToggleBtn = document.getElementById('sound-toggle');
const saveForm = document.getElementById('save-form');
const nameInput = document.getElementById('player-name');
const saveBtn = document.getElementById('save-score');

// Visual FX: floating 'Game Over MFKR' text + flash/shake on canvas wrap
function triggerGameOverVisualFx() {
  const wrap = document.querySelector('.canvas-wrap');
  if (!wrap) return;
  // Flash and shake classes
  try {
    wrap.classList.add('flash');
    wrap.classList.add('shake');
    setTimeout(() => wrap.classList.remove('flash'), 300);
    setTimeout(() => wrap.classList.remove('shake'), 600);
  } catch {}
  // Floating text element
  try {
    const el = document.createElement('div');
    el.className = 'floating-go';
    el.textContent = 'Game Over MFKR';
    el.setAttribute('aria-hidden', 'true');
    wrap.appendChild(el);
    const cleanup = () => { try { el.remove(); } catch {} };
    el.addEventListener('animationend', cleanup, { once: true });
    // Safety cleanup in case animationend isn't fired
    setTimeout(cleanup, 1500);
  } catch {}
}

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

const renderer = createRenderer(canvas, scoreEl, overlayEl, finalScoreEl, finalTimeEl, finalDifficultyEl, finalRankEl);
let lastOnClick = null;
let lastOnKeyDown = null;
let game = null;

function ensureGame() {
  if (game) return game;
  game = createGame(renderer, {
    restartBtn,
    difficultySel,
    onGameOver: (score, durationMs) => {
      // Remove any lingering listeners from any previous overlay-driven flow
      if (lastOnClick) saveBtn?.removeEventListener('click', lastOnClick);
      if (lastOnKeyDown) nameInput?.removeEventListener('keydown', lastOnKeyDown);
      lastOnClick = null;
      lastOnKeyDown = null;

      // Save the score immediately so leaderboard reflects final rank
      const difficulty = normalizeDifficulty(difficultySel?.value);
      const defaultName = getLastUsedName();
      const entered = (nameInput?.value ?? '').trim() || defaultName;
      let savedRank = null;
      try {
        const result = addScore(entered, score, difficulty, durationMs, Date.now());
        const entries = result?.entries || loadLeaderboard();
        savedRank = result?.rank ?? null;
        // Re-render all three leaderboards by difficulty
        renderLeaderboard(leaderboardEasyEl, getTopByDifficulty('easy'));
        renderLeaderboard(leaderboardMediumEl, getTopByDifficulty('medium'));
        renderLeaderboard(leaderboardHardEl, getTopByDifficulty('hard'));
        // Ensure only the selected difficulty's leaderboard is visible
        try { updateLeaderboardVisibility(); } catch {}
        // Highlight the just-saved score if visible
        try {
          // Clear previous highlights on all boards
          [leaderboardEasyEl, leaderboardMediumEl, leaderboardHardEl].forEach(list => {
            if (!list) return;
            list.querySelectorAll('li.highlight').forEach(li => li.classList.remove('highlight'));
            list.querySelectorAll('li[aria-current="true"]').forEach(li => li.removeAttribute('aria-current'));
          });
          const d = difficulty;
          const rank = savedRank;
          if (Number.isFinite(rank) && rank > 0) {
            const map = { easy: leaderboardEasyEl, medium: leaderboardMediumEl, hard: leaderboardHardEl };
            const listEl = map[d];
            const container = listEl ? (listEl.closest('div') || listEl.parentElement) : null;
            const isVisible = !!(container && container.style.display !== 'none');
            if (listEl && isVisible) {
              const idx = rank - 1;
              const items = Array.from(listEl.children);
              if (idx >= 0 && idx < items.length) {
                const li = items[idx];
                li.classList.add('highlight');
                li.setAttribute('aria-current', 'true');
              }
            }
          }
        } catch {}
      } catch {}

      // Populate overlay content (we will show it after a brief FX)
      const titleEl = document.getElementById('gameover-title');
      if (titleEl) titleEl.textContent = 'Game Over';
      // Hide all final stats on the Game Over view per requirement
      if (finalScoreEl) finalScoreEl.hidden = true;
      if (finalTimeEl) finalTimeEl.hidden = true;
      if (finalDifficultyEl) finalDifficultyEl.hidden = true;
      if (finalRankEl) finalRankEl.hidden = true;

      if (nameInput) {
        // Keep the last used/entered name for the next run; allow editing now
        nameInput.disabled = false;
        if (!nameInput.value) nameInput.value = defaultName;
      }
      if (saveBtn) {
        saveBtn.textContent = 'Play again';
        saveBtn.disabled = false;
      }

      // Trigger visual FX over the grid and delay showing the overlay so it’s visible
      try { triggerGameOverVisualFx(); } catch {}

      // Wire up restart flow from the overlay (we’ll attach listeners now; overlay shows shortly)
      const onClick = () => {
        if (!isNameValid()) { try { nameInput?.focus(); } catch {} return; }
        // Hide overlay and restart game
        startOverlayEl?.classList.remove('show');
        startOverlayEl?.setAttribute('aria-hidden', 'true');
        // Ensure focus is not left on hidden controls during gameplay
        try { nameInput?.blur(); } catch {}
        try { saveBtn?.blur(); } catch {}
        try { game.restart(); } catch {}
        try { canvas.focus(); } catch {}
      };
      const onKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); onClick(); } };

      saveBtn?.removeEventListener('click', onClick); // ensure no dupes (just in case)
      nameInput?.removeEventListener('keydown', onKeyDown);
      saveBtn?.addEventListener('click', onClick);
      nameInput?.addEventListener('keydown', onKeyDown);
      lastOnClick = onClick;
      lastOnKeyDown = onKeyDown;

      // Show overlay after a short delay to let FX be seen
      window.setTimeout(() => {
        startOverlayEl?.classList.add('show');
        startOverlayEl?.setAttribute('aria-hidden', 'false');
      }, 900);
    },
  });
  return game;
}

// Initial leaderboard render on the welcome/restart overlay
renderLeaderboard(leaderboardEasyEl, getTopByDifficulty('easy'));
renderLeaderboard(leaderboardMediumEl, getTopByDifficulty('medium'));
renderLeaderboard(leaderboardHardEl, getTopByDifficulty('hard'));

// Show only the leaderboard for the currently selected difficulty (hide section incl. header/caption)
function updateLeaderboardVisibility() {
  const cur = normalizeDifficulty(difficultySel?.value);
  const map = {
    easy: leaderboardEasyEl,
    medium: leaderboardMediumEl,
    hard: leaderboardHardEl,
  };
  for (const [key, el] of Object.entries(map)) {
    if (!el) continue;
    const container = el.closest('div') || el.parentElement; // wrapper contains heading + list
    const active = key === cur;
    // Hide/show whole section (header + list)
    if (container) {
      container.style.display = active ? '' : 'none';
      container.setAttribute('aria-hidden', String(!active));
    }
    // Also reflect aria on the list itself for redundancy
    el.setAttribute('aria-hidden', String(!active));
    el.style.display = active ? '' : 'none';
  }
}

// Apply initial visibility and update when difficulty changes
updateLeaderboardVisibility();
try { difficultySel?.addEventListener('change', updateLeaderboardVisibility); } catch {}

function isNameValid() {
  return (nameInput?.value ?? '').trim().length > 0;
}

function updatePlayButtonState() {
  if (!saveBtn) return;
  // Enable only when a non-empty name is provided
  saveBtn.disabled = !isNameValid();
}

function enterPrestartMode() {
  // Configure the unified overlay for starting a new game
  const titleEl = document.getElementById('gameover-title');
  titleEl && (titleEl.textContent = 'Welcome to Snake');
  // Hide any final stats from a previous run
  if (finalScoreEl) finalScoreEl.hidden = true;
  if (finalTimeEl) finalTimeEl.hidden = true;
  if (finalDifficultyEl) finalDifficultyEl.hidden = true;
  if (finalRankEl) finalRankEl.hidden = true;

  if (lastOnClick) saveBtn?.removeEventListener('click', lastOnClick);
  if (lastOnKeyDown) nameInput?.removeEventListener('keydown', lastOnKeyDown);
  lastOnClick = null;
  lastOnKeyDown = null;

  if (nameInput) {
    // Prefill with last known name (fallback to "Player") and allow immediate start
    nameInput.disabled = false;
    const defaultName = getLastUsedName();
    nameInput.value = defaultName;
    try { nameInput.focus(); if (typeof nameInput.select === 'function') nameInput.select(); } catch {}
  }
  if (saveBtn) {
    saveBtn.textContent = 'Play';
  }
  updatePlayButtonState();

  // When valid, start the game and hide the overlay
  const onClick = () => {
    if (!isNameValid()) { try { nameInput?.focus(); } catch {} return; }
    startOverlayEl?.classList.remove('show');
    startOverlayEl?.setAttribute('aria-hidden', 'true');
    // Ensure focus is not left on hidden controls during gameplay
    try { nameInput?.blur(); } catch {}
    try { saveBtn?.blur(); } catch {}
    ensureGame().start();
    try { canvas.focus(); } catch {}
  };
  const onKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); onClick(); } };

  saveBtn?.addEventListener('click', onClick);
  nameInput?.addEventListener('keydown', onKeyDown);
  nameInput?.addEventListener('input', updatePlayButtonState);
  lastOnClick = onClick;
  lastOnKeyDown = onKeyDown;
}

// Initialize unified overlay in pre-start mode
enterPrestartMode();
