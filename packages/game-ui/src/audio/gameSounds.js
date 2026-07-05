const STORAGE_KEY = "taskefabrik-sound-muted";

let audioCtx = null;
let muted =
  typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function isSoundMuted() {
  return muted;
}

export function setSoundMuted(value) {
  muted = value;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  }
}

export function resumeAudio() {
  getCtx();
}

function playTone({ freq, duration = 0.12, type = "sine", gain = 0.07, when = 0, slideTo }) {
  const ctx = getCtx();
  if (!ctx || muted) return;

  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime + when;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function playNoise({ duration = 0.06, gain = 0.04, when = 0, filterFreq = 900 }) {
  const ctx = getCtx();
  if (!ctx || muted) return;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime + when;

  src.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = 0.8;

  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  src.connect(filter);
  filter.connect(amp);
  amp.connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + duration);
}

const SOUNDS = {
  click() {
    playTone({ freq: 520, duration: 0.05, gain: 0.04 });
  },
  deny() {
    playTone({ freq: 180, duration: 0.1, type: "square", gain: 0.025 });
  },
  enter() {
    playTone({ freq: 330, duration: 0.14, gain: 0.06 });
    playTone({ freq: 440, duration: 0.18, gain: 0.055, when: 0.08 });
    playTone({ freq: 554, duration: 0.22, gain: 0.05, when: 0.16 });
  },
  craft() {
    playNoise({ duration: 0.05, gain: 0.035, filterFreq: 1200 });
    playTone({ freq: 280, duration: 0.08, type: "triangle", gain: 0.04, when: 0.02 });
    playNoise({ duration: 0.04, gain: 0.03, filterFreq: 1400, when: 0.07 });
  },
  complete() {
    playTone({ freq: 392, duration: 0.1, gain: 0.055 });
    playTone({ freq: 523, duration: 0.14, gain: 0.05, when: 0.07 });
  },
  sell() {
    playTone({ freq: 880, duration: 0.07, type: "triangle", gain: 0.06 });
    playTone({ freq: 1175, duration: 0.12, type: "triangle", gain: 0.055, when: 0.06 });
    playTone({ freq: 1568, duration: 0.1, gain: 0.04, when: 0.12 });
  },
  upgrade() {
    playTone({ freq: 440, duration: 0.1, gain: 0.05 });
    playTone({ freq: 554, duration: 0.12, gain: 0.05, when: 0.08 });
    playTone({ freq: 659, duration: 0.16, gain: 0.045, when: 0.16 });
  },
  tick() {
    playTone({ freq: 240, duration: 0.04, type: "triangle", gain: 0.035 });
    playNoise({ duration: 0.025, gain: 0.015, filterFreq: 600, when: 0.01 });
  },
  event() {
    playTone({ freq: 349, duration: 0.1, type: "square", gain: 0.03 });
    playTone({ freq: 440, duration: 0.12, type: "square", gain: 0.028, when: 0.1 });
  },
  win() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      playTone({ freq, duration: 0.2, gain: 0.055, when: i * 0.1 });
    });
  },
  lose() {
    playTone({ freq: 220, duration: 0.25, type: "sawtooth", gain: 0.04, slideTo: 110 });
  },
};

export function playGameSound(name) {
  const fn = SOUNDS[name];
  if (fn) fn();
}