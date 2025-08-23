// Input module: captures keyboard and queues direction changes
import { DIRS, opposite } from './state.js';

const KEY_TO_DIR = new Map([
  ['ArrowUp', DIRS.Up], ['KeyW', DIRS.Up],
  ['ArrowDown', DIRS.Down], ['KeyS', DIRS.Down],
  ['ArrowLeft', DIRS.Left], ['KeyA', DIRS.Left],
  ['ArrowRight', DIRS.Right], ['KeyD', DIRS.Right],
]);

export function bindInput(state) {
  function onKeyDown(e) {
    const dir = KEY_TO_DIR.get(e.code);
    if (!dir) return;
    e.preventDefault();

    const lastQueued = state.dirQueue.length ? state.dirQueue[state.dirQueue.length - 1] : state.dir;
    if (opposite(lastQueued, dir)) return; // prevent 180 reversal

    state.dirQueue.push(dir);
  }

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
