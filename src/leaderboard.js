// Leaderboard module: manages persistent high scores in localStorage
// v2: store per difficulty under separate keys; migrate from legacy v1 combined key if present
const LEGACY_KEY = 'snake.leaderboard.v1'; // legacy schema: single array of mixed difficulties
const KEYS = {
  easy: 'snake.leaderboard.v2.easy',
  medium: 'snake.leaderboard.v2.medium',
  hard: 'snake.leaderboard.v2.hard',
};
export const MAX_ENTRIES = 10;

// Aggregate load across all difficulties (for utilities like last-used-name)
export function loadLeaderboard() {
  try {
    migrateFromLegacyIfNeeded();
    const all = [];
    for (const d of ['easy', 'medium', 'hard']) {
      const raw = localStorage.getItem(KEYS[d]);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) all.push(...parsed);
    }
    return sanitize(all);
  } catch {
    return [];
  }
}

// Save combined entries back into individual per-difficulty keys (rarely used directly)
export function saveLeaderboard(entries) {
  try {
    const per = { easy: [], medium: [], hard: [] };
    (Array.isArray(entries) ? entries : []).forEach(e => {
      const d = normalizeDifficulty(e?.difficulty);
      per[d].push(sanitizeOne(e));
    });
    for (const d of ['easy', 'medium', 'hard']) {
      const trimmed = trimAndSort(per[d], MAX_ENTRIES);
      localStorage.setItem(KEYS[d], JSON.stringify(trimmed));
    }
  } catch {
    // ignore quota or serialization errors
  }
}

export function addScore(name, score, difficulty, durationMs, ts = Date.now()) {
  const d = normalizeDifficulty(difficulty);
  const prev = loadLeaderboardByDifficulty(d);
  const entry = {
    name: normalizeName(name),
    score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0,
    difficulty: d,
    durationMs: Number.isFinite(durationMs) ? Math.max(0, Math.floor(durationMs)) : 0,
    ts: typeof ts === 'number' ? ts : Date.now(),
  };
  const merged = [...prev, entry]
    .filter(Boolean)
    .map(sanitizeOne);
  const sorted = trimAndSort(merged, MAX_ENTRIES);

  // Rank within the same difficulty (1-based)
  const rank = [...merged]
    .sort((a, b) => (b.score - a.score) || (a.ts - b.ts))
    .findIndex(e => e.ts === entry.ts && e.score === entry.score && e.name === entry.name) + 1;

  saveLeaderboardByDifficulty(d, sorted);

  // Return combined entries for compatibility where needed
  const combined = sanitize([...loadLeaderboard()]);
  return { entries: combined, rank };
}

export function getTopByDifficulty(difficulty, n = MAX_ENTRIES) {
  const d = normalizeDifficulty(difficulty);
  return loadLeaderboardByDifficulty(d).slice(0, n);
}

export function getTop(n = MAX_ENTRIES) {
  // Backward-compatible: return top across all difficulties, already trimmed per difficulty
  return trimPerDifficulty(loadLeaderboard(), n);
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(KEYS.easy);
    localStorage.removeItem(KEYS.medium);
    localStorage.removeItem(KEYS.hard);
  } catch {}
}

export function renderLeaderboard(listEl, entries) {
  if (!listEl) return;
  const list = Array.isArray(entries) ? entries : [];
  listEl.innerHTML = '';
  const frag = document.createDocumentFragment();
  if (!list.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No scores yet';
    frag.appendChild(li);
  } else {
    list.forEach((e, idx) => {
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
export function getProvisionalRank(score, difficulty = 'medium') {
  const s = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  const d = normalizeDifficulty(difficulty);
  const entries = loadLeaderboardByDifficulty(d);
  const dummy = { name: '__current__', score: s, difficulty: d, durationMs: 0, ts: Date.now() };
  const merged = [...entries, dummy].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.ts - b.ts;
  });
  const idx = merged.findIndex(e => e === dummy);
  return idx >= 0 ? idx + 1 : merged.length + 1;
}

function migrateFromLegacyIfNeeded() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) { localStorage.removeItem(LEGACY_KEY); return; }
    const cleaned = sanitize(parsed);
    const per = { easy: [], medium: [], hard: [] };
    cleaned.forEach(e => { per[normalizeDifficulty(e.difficulty)].push(e); });
    for (const d of ['easy', 'medium', 'hard']) {
      const trimmed = trimAndSort(per[d], MAX_ENTRIES);
      localStorage.setItem(KEYS[d], JSON.stringify(trimmed));
    }
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}

function loadLeaderboardByDifficulty(difficulty) {
  try {
    migrateFromLegacyIfNeeded();
    const d = normalizeDifficulty(difficulty);
    const raw = localStorage.getItem(KEYS[d]);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return trimAndSort(parsed, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function saveLeaderboardByDifficulty(difficulty, entries) {
  try {
    const d = normalizeDifficulty(difficulty);
    const trimmed = trimAndSort(entries || [], MAX_ENTRIES);
    localStorage.setItem(KEYS[d], JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function sanitize(list) {
  const cleaned = list
    .filter(e => e && typeof e === 'object')
    .map(sanitizeOne)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.ts - b.ts;
    });
  return trimPerDifficulty(cleaned, MAX_ENTRIES);
}

function sanitizeOne(e) {
  return {
    name: normalizeName(e.name),
    score: Number.isFinite(e.score) ? Math.max(0, Math.floor(e.score)) : 0,
    difficulty: normalizeDifficulty(e.difficulty),
    durationMs: Number.isFinite(e.durationMs) ? Math.max(0, Math.floor(e.durationMs)) : 0,
    ts: typeof e.ts === 'number' ? e.ts : Date.now(),
  };
}

function trimPerDifficulty(entries, perDiffLimit = MAX_ENTRIES) {
  const diffs = ['easy', 'medium', 'hard'];
  const buckets = { easy: [], medium: [], hard: [] };
  for (const e of entries) {
    const d = normalizeDifficulty(e.difficulty);
    buckets[d].push(e);
  }
  const out = [];
  for (const d of diffs) {
    const sorted = trimAndSort(buckets[d], perDiffLimit);
    out.push(...sorted);
  }
  return out;
}

function trimAndSort(entries, limit = MAX_ENTRIES) {
  return (entries || [])
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.ts - b.ts;
    })
    .slice(0, limit);
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
