// Leaderboard module: manages persistent high scores in localStorage
const STORAGE_KEY = 'snake.leaderboard.v1';
const MAX_ENTRIES = 10;

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

export function addScore(name, score, ts = Date.now()) {
  const entries = loadLeaderboard();
  const entry = {
    name: normalizeName(name),
    score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0,
    ts: typeof ts === 'number' ? ts : Date.now(),
  };
  const merged = [...entries, entry]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // higher score first
      return a.ts - b.ts; // earlier timestamp first as tiebreaker
    })
    .slice(0, MAX_ENTRIES);
  saveLeaderboard(merged);
  return merged;
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
      li.innerHTML = `<span class="rank">${idx + 1}.</span> <span class="name"></span> <span class="score">${e.score}</span>`;
      li.querySelector('.name').textContent = e.name;
      frag.appendChild(li);
    });
  }
  listEl.appendChild(frag);
}

function sanitize(list) {
  return list
    .filter(e => e && typeof e === 'object')
    .map(e => ({
      name: normalizeName(e.name),
      score: Number.isFinite(e.score) ? Math.max(0, Math.floor(e.score)) : 0,
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
