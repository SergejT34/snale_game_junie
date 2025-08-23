// Leaderboard module: manages persistent high scores in localStorage
const STORAGE_KEY = 'snake.leaderboard.v1'; // schema: { name, score, difficulty, durationMs?, ts }
export const MAX_ENTRIES = 10;

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sanitize(parsed);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota or serialization errors
  }
}

export function addScore(name, score, difficulty, durationMs, ts = Date.now()) {
  const entries = loadLeaderboard();
  const entry = {
    name: normalizeName(name),
    score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0,
    difficulty: normalizeDifficulty(difficulty),
    durationMs: Number.isFinite(durationMs) ? Math.max(0, Math.floor(durationMs)) : 0,
    ts: typeof ts === 'number' ? ts : Date.now(),
  };
  const mergedAll = [...entries, entry]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // higher score first
      return a.ts - b.ts; // earlier timestamp first as tiebreaker
    });
  const rank = mergedAll.findIndex(e => e.ts === entry.ts && e.score === entry.score && e.name === entry.name) + 1;
  const mergedTop = mergedAll.slice(0, MAX_ENTRIES);
  saveLeaderboard(mergedTop);
  return { entries: mergedTop, rank };
}

export function getTop(n = MAX_ENTRIES) {
  return loadLeaderboard().slice(0, n);
}

export function clearLeaderboard() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function renderLeaderboard(listEl, entries = getTop()) {
  if (!listEl) return;
  listEl.innerHTML = '';
  const frag = document.createDocumentFragment();
  if (!entries.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No scores yet';
    frag.appendChild(li);
  } else {
    entries.forEach((e, idx) => {
      const li = document.createElement('li');
      const diffLabel = labelDifficulty(e.difficulty);
      const timeLabel = formatDuration(e.durationMs);
      li.innerHTML = `<span class="rank">${idx + 1}.</span> <span class="name"></span> <span class="difficulty" aria-label="Difficulty">${diffLabel}</span> <span class="time" aria-label="Time">${timeLabel}</span> <span class="score">${e.score}</span>`;
      li.querySelector('.name').textContent = e.name;
      frag.appendChild(li);
    });
  }
  listEl.appendChild(frag);
}

// Compute the hypothetical rank for a given score compared to current leaderboard entries.
// Returns a 1-based rank number. If there are no entries, returns 1 when score >= 0.
export function getProvisionalRank(score) {
  const s = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  const entries = loadLeaderboard();
  const dummy = { name: '__current__', score: s, difficulty: 'medium', durationMs: 0, ts: Date.now() };
  const merged = [...entries, dummy].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.ts - b.ts;
  });
  const idx = merged.findIndex(e => e === dummy);
  return idx >= 0 ? idx + 1 : merged.length + 1;
}

function sanitize(list) {
  return list
    .filter(e => e && typeof e === 'object')
    .map(e => ({
      name: normalizeName(e.name),
      score: Number.isFinite(e.score) ? Math.max(0, Math.floor(e.score)) : 0,
      difficulty: normalizeDifficulty(e.difficulty),
      durationMs: Number.isFinite(e.durationMs) ? Math.max(0, Math.floor(e.durationMs)) : 0,
      ts: typeof e.ts === 'number' ? e.ts : Date.now(),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.ts - b.ts;
    })
    .slice(0, MAX_ENTRIES);
}

function normalizeName(name) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return 'Player';
  // Limit to 20 visible chars
  return trimmed.slice(0, 20);
}

function normalizeDifficulty(difficulty) {
  const val = String(difficulty ?? '').toLowerCase();
  if (val === 'easy' || val === 'medium' || val === 'hard') return val;
  return 'medium';
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
