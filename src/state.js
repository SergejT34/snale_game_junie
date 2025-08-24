// State module: holds and initializes game state
export const GRID_SIZE = 20;
export const DEFAULT_TICK_MS = 150;

export const DIFFICULTY_SPEEDS = {
  easy: 200,
  medium: 150,
  hard: 100,
};
export const DEFAULT_DIFFICULTY = 'medium';

export const DIRS = {
  Up: { x: 0, y: -1, name: 'Up' },
  Down: { x: 0, y: 1, name: 'Down' },
  Left: { x: -1, y: 0, name: 'Left' },
  Right: { x: 1, y: 0, name: 'Right' },
};

export function opposite(a, b) {
  if (!a || !b) return false;
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function createInitialState(opts = {}) {
  const { tickMs = DEFAULT_TICK_MS, difficulty = DEFAULT_DIFFICULTY } = opts;
  const mid = Math.floor(GRID_SIZE / 2);
  // Snake length 3, pointing Right initially
  const snake = [
    { x: mid - 1, y: mid },
    { x: mid, y: mid },
    { x: mid + 1, y: mid },
  ];
  const occupied = new Set(snake.map(p => key(p.x, p.y)));

  const food = placeFood(occupied);
  // Place a shrinker (hazard) item based on spawn chance; may start absent
  const shrinker = (Math.random() < HAZARD_SPAWN_CHANCE) ? placeShrinker(occupied, food) : null;

  return {
    grid: GRID_SIZE,
    snake, // tail -> ... -> head at end
    occupied, // Set of keys for O(1) collision check
    dir: DIRS.Right,
    dirQueue: [], // queued direction inputs this tick
    food,
    shrinker,
    // When true, clear shrinker at the start of the next tick (after food spawned)
    pendingShrinkerClear: false,
    score: 0,
    status: 'running', // 'running' | 'over'
    tickMs,
    difficulty,
    startedAt: Date.now(), // timestamp when this run started (for duration tracking)
  };
}

export function key(x, y) { return `${x},${y}`; }

export const FOOD_EMOJIS = [
  '🍎','🍌','🍒','🍇','🍓','🍉','🍋','🍊','🍐','🥝',
  '🥕','🌽','🍆','🥦','🧀','🍕','🍪','🍩','🍙','🍔'
];

export const HAZARD_EMOJIS = [
  '💣','☠️','💀','🧨','🧫','🧪'
];

// Probability to spawn a non-eatable hazard when eligible (0..1)
export const HAZARD_SPAWN_CHANCE = 0.5;

export function placeFood(occupied) {
  const empty = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const k = key(x, y);
      if (!occupied.has(k)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return null; // filled board
  const idx = Math.floor(Math.random() * empty.length);
  const spot = empty[idx];
  const emoji = FOOD_EMOJIS[(Math.random() * FOOD_EMOJIS.length) | 0];
  return { x: spot.x, y: spot.y, emoji };
}

export function placeShrinker(occupied, avoidFood) {
  const empty = [];
  const avoidKey = avoidFood ? key(avoidFood.x, avoidFood.y) : null;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const k = key(x, y);
      if (!occupied.has(k) && k !== avoidKey) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return null;
  const idx = Math.floor(Math.random() * empty.length);
  const spot = empty[idx];
  const emoji = HAZARD_EMOJIS[(Math.random() * HAZARD_EMOJIS.length) | 0];
  return { x: spot.x, y: spot.y, emoji };
}
