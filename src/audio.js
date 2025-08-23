// Audio module: simple retro-style effects with Web Audio API
// Provides small, dependency-free effects reminiscent of classic platformer sounds.
// Exports: init(), playFood(), playDeath(), playStart(), toggleMuted(), setMuted(), isMuted()

let ctx = null;
let muted = false;
let initialized = false;

function ensureContext() {
  if (muted) return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return ctx;
}

function onFirstGestureInit() {
  if (initialized) return;
  initialized = true;
  const resume = () => {
    if (!ctx) return;
    if (typeof ctx.resume === 'function') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
}

export function init() {
  ensureContext();
  onFirstGestureInit();
}

export function setMuted(v) {
  muted = !!v;
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

export function isMuted() { return muted; }

function createOsc(type, freq, when, duration, gain = 0.05) {
  const ac = ensureContext();
  if (!ac) return null;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  g.gain.setValueAtTime(0, when);
  // Quick attack and decay
  g.gain.linearRampToValueAtTime(gain, when + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(when);
  osc.stop(when + duration + 0.01);
  return { osc, g };
}

// Coin-like sound: two quick ascending square blips
export function playFood() {
  if (muted) return;
  const ac = ensureContext();
  if (!ac) return;
  const t = ac.currentTime;
  createOsc('square', 880, t, 0.06, 0.06);
  createOsc('square', 1320, t + 0.06, 0.05, 0.05);
}

// Death sound: descending sawtooth with slight detune and a thud
export function playDeath() {
  if (muted) return;
  const ac = ensureContext();
  if (!ac) return;
  const t = ac.currentTime;
  // Descend
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(600, t);
  o.frequency.exponentialRampToValueAtTime(80, t + 0.5);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + 0.65);
  // Thud (short noise burst via very low sine)
  createOsc('sine', 60, t + 0.02, 0.1, 0.08);
}

// Start sound: small arpeggio
export function playStart() {
  if (muted) return;
  const ac = ensureContext();
  if (!ac) return;
  const t = ac.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
  notes.forEach((f, i) => createOsc('triangle', f, t + i * 0.06, 0.08, 0.04));
}
