// Audio module: simple retro-style effects with Web Audio API
// Provides small, dependency-free effects reminiscent of classic platformer sounds.
// Exports: init(), playFood(), playDeath(), playStart(), startMusic(), stopMusic(), isMusicPlaying(), toggleMuted(), setMuted(), isMuted()

let ctx = null;
let muted = false;
let initialized = false;

// Background music state
let musicTimer = null; // setInterval id
let musicStep = 0;     // index into pattern
let musicGain = null;  // master gain for music
let musicActive = false;

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
  if (muted) {
    // Hard stop any ongoing music on mute
    stopMusic();
  }
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

// --- Background Music (simple chiptune-like loop) ---
// A minimal "Mario-like" upbeat pattern using square lead and triangle bass.
// No external assets; uses short notes scheduled at a steady tempo and loops.
let musicBpm = 140;              // default tempo
function getBeatSec() { return 60 / musicBpm; }
function getNoteSec() { return getBeatSec() * 0.9; } // leave tiny gap

// Lead melody (frequencies in Hz), using a C major-like motif over 2 bars (8 beats)
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.00;
const melody = [
  C5, E5, G5, E5,   D5, E5, G5, C5,
];
// Bass notes (triangle) one per beat (C major root + dominant)
const C3 = 130.81, G3 = 196.00;
const bass = [ C3, C3, G3, C3,  C3, C3, G3, C3 ];

export function startMusic(bpm) {
  if (musicActive) return; // already playing
  if (muted) return;
  const ac = ensureContext();
  if (!ac) return;

  if (Number.isFinite(bpm)) {
    // Clamp to a sensible range
    musicBpm = Math.max(60, Math.min(220, bpm));
  }

  if (!musicGain) {
    musicGain = ac.createGain();
    musicGain.gain.value = 0.12; // master music level (quiet under SFX)
    musicGain.connect(ac.destination);
  }

  musicActive = true;
  musicStep = musicStep % melody.length;

  const scheduleStep = () => {
    if (!musicActive || muted) return;
    const NOTE_SEC = getNoteSec();
    const now = ac.currentTime;
    const when = now + 0.01; // slight lookahead

    // Lead note
    const leadFreq = melody[musicStep % melody.length];
    const leadGain = Math.random() * 0.01 + 0.035; // tiny variation keeps it lively
    const lead = ac.createOscillator();
    const leadEnv = ac.createGain();
    lead.type = 'square';
    lead.frequency.setValueAtTime(leadFreq, when);
    leadEnv.gain.setValueAtTime(0.0001, when);
    leadEnv.gain.exponentialRampToValueAtTime(leadGain, when + 0.01);
    leadEnv.gain.exponentialRampToValueAtTime(0.0001, when + NOTE_SEC);
    lead.connect(leadEnv).connect(musicGain);
    lead.start(when);
    lead.stop(when + NOTE_SEC + 0.02);

    // Bass note (on every beat)
    const bassFreq = bass[musicStep % bass.length];
    const b = ac.createOscillator();
    const bEnv = ac.createGain();
    b.type = 'triangle';
    b.frequency.setValueAtTime(bassFreq, when);
    bEnv.gain.setValueAtTime(0.0001, when);
    bEnv.gain.exponentialRampToValueAtTime(0.03, when + 0.015);
    bEnv.gain.exponentialRampToValueAtTime(0.0001, when + NOTE_SEC);
    b.connect(bEnv).connect(musicGain);
    b.start(when);
    b.stop(when + NOTE_SEC + 0.02);

    musicStep = (musicStep + 1) % melody.length;
  };

  // Schedule first immediately, then at tempo intervals
  scheduleStep();
  musicTimer = window.setInterval(() => {
    try { scheduleStep(); } catch {}
  }, getBeatSec() * 1000);
}

export function stopMusic() {
  if (!musicActive) return;
  musicActive = false;
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

export function isMusicPlaying() {
  return musicActive;
}

// --- Sound Effects ---
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
  o.connect(g).connect(ctx ? ctx.destination : null);
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
