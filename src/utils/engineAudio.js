/**
 * Zurich OS — Maserati Nettuno V6 Engine Audio Synthesizer
 * 
 * Uses the Web Audio API to generate realistic engine sounds
 * without any external audio files. Works fully offline.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Creates filtered noise (used for mechanical/exhaust textures)
 */
function createNoise(ctx, duration, type = 'brown') {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  } else {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buffer;
}

/**
 * Starter Motor Sound — mechanical cranking whir
 * Simulates the electric starter motor engaging
 */
export function playStarterSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 0.8;

  // Master gain
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.15, now + 0.05);
  master.gain.setValueAtTime(0.15, now + duration - 0.1);
  master.gain.linearRampToValueAtTime(0, now + duration);
  master.connect(ctx.destination);

  // High-pitched starter whine (sawtooth for metallic texture)
  const starterOsc = ctx.createOscillator();
  starterOsc.type = 'sawtooth';
  starterOsc.frequency.setValueAtTime(180, now);
  starterOsc.frequency.linearRampToValueAtTime(320, now + 0.3);
  starterOsc.frequency.setValueAtTime(320, now + 0.5);
  starterOsc.frequency.linearRampToValueAtTime(280, now + duration);

  // Bandpass filter for realistic starter motor tone
  const starterFilter = ctx.createBiquadFilter();
  starterFilter.type = 'bandpass';
  starterFilter.frequency.value = 600;
  starterFilter.Q.value = 2;

  const starterGain = ctx.createGain();
  starterGain.gain.value = 0.6;

  starterOsc.connect(starterFilter);
  starterFilter.connect(starterGain);
  starterGain.connect(master);
  starterOsc.start(now);
  starterOsc.stop(now + duration);

  // Mechanical clicking/cranking texture
  const clickBuffer = createNoise(ctx, duration, 'white');
  const clickSource = ctx.createBufferSource();
  clickSource.buffer = clickBuffer;

  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = 'highpass';
  clickFilter.frequency.value = 2000;

  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.08;

  clickSource.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(master);
  clickSource.start(now);
  clickSource.stop(now + duration);

  // Subtle sub-bass rumble from the cranking
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(40, now);
  subOsc.frequency.linearRampToValueAtTime(60, now + duration);

  const subGain = ctx.createGain();
  subGain.gain.value = 0.1;

  subOsc.connect(subGain);
  subGain.connect(master);
  subOsc.start(now);
  subOsc.stop(now + duration);
}

/**
 * Ignition / Rev Sound — the engine catching and roaring to life
 * Simulates V6 twin-turbo ignition burst
 */
export function playIgnitionSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 2.0;

  // Master output
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.25, now + 0.15);
  master.gain.setValueAtTime(0.25, now + 0.8);
  master.gain.linearRampToValueAtTime(0.12, now + 1.4);
  master.gain.setValueAtTime(0.12, now + 1.6);
  master.gain.linearRampToValueAtTime(0, now + duration);
  master.connect(ctx.destination);

  // Primary engine tone — deep fundamental (V6 idle ~700rpm = ~35Hz firing freq)
  const engOsc1 = ctx.createOscillator();
  engOsc1.type = 'sawtooth';
  engOsc1.frequency.setValueAtTime(55, now);
  engOsc1.frequency.exponentialRampToValueAtTime(120, now + 0.3);
  engOsc1.frequency.exponentialRampToValueAtTime(85, now + 1.0);
  engOsc1.frequency.setValueAtTime(85, now + 1.5);
  engOsc1.frequency.linearRampToValueAtTime(70, now + duration);

  const engGain1 = ctx.createGain();
  engGain1.gain.value = 0.5;

  // Lowpass to shape the rumble
  const engFilter1 = ctx.createBiquadFilter();
  engFilter1.type = 'lowpass';
  engFilter1.frequency.setValueAtTime(200, now);
  engFilter1.frequency.exponentialRampToValueAtTime(800, now + 0.3);
  engFilter1.frequency.exponentialRampToValueAtTime(400, now + 1.0);
  engFilter1.Q.value = 1;

  engOsc1.connect(engFilter1);
  engFilter1.connect(engGain1);
  engGain1.connect(master);
  engOsc1.start(now);
  engOsc1.stop(now + duration);

  // Second harmonic — gives the "twin-turbo" upper register
  const engOsc2 = ctx.createOscillator();
  engOsc2.type = 'square';
  engOsc2.frequency.setValueAtTime(110, now);
  engOsc2.frequency.exponentialRampToValueAtTime(240, now + 0.3);
  engOsc2.frequency.exponentialRampToValueAtTime(170, now + 1.0);
  engOsc2.frequency.linearRampToValueAtTime(140, now + duration);

  const engGain2 = ctx.createGain();
  engGain2.gain.value = 0.15;

  const engFilter2 = ctx.createBiquadFilter();
  engFilter2.type = 'bandpass';
  engFilter2.frequency.value = 300;
  engFilter2.Q.value = 0.5;

  engOsc2.connect(engFilter2);
  engFilter2.connect(engGain2);
  engGain2.connect(master);
  engOsc2.start(now);
  engOsc2.stop(now + duration);

  // Exhaust noise texture — brown noise for that throaty exhaust character
  const exhaustBuffer = createNoise(ctx, duration, 'brown');
  const exhaustSource = ctx.createBufferSource();
  exhaustSource.buffer = exhaustBuffer;

  const exhaustFilter = ctx.createBiquadFilter();
  exhaustFilter.type = 'bandpass';
  exhaustFilter.frequency.setValueAtTime(150, now);
  exhaustFilter.frequency.exponentialRampToValueAtTime(600, now + 0.3);
  exhaustFilter.frequency.exponentialRampToValueAtTime(250, now + 1.0);
  exhaustFilter.Q.value = 0.8;

  const exhaustGain = ctx.createGain();
  exhaustGain.gain.setValueAtTime(0, now);
  exhaustGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
  exhaustGain.gain.setValueAtTime(0.35, now + 0.5);
  exhaustGain.gain.linearRampToValueAtTime(0.15, now + 1.2);
  exhaustGain.gain.linearRampToValueAtTime(0, now + duration);

  exhaustSource.connect(exhaustFilter);
  exhaustFilter.connect(exhaustGain);
  exhaustGain.connect(master);
  exhaustSource.start(now);
  exhaustSource.stop(now + duration);

  // Initial ignition "pop" — short burst simulating first combustion
  const popOsc = ctx.createOscillator();
  popOsc.type = 'sine';
  popOsc.frequency.setValueAtTime(100, now);
  popOsc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

  const popGain = ctx.createGain();
  popGain.gain.setValueAtTime(0.4, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  popOsc.connect(popGain);
  popGain.connect(master);
  popOsc.start(now);
  popOsc.stop(now + 0.3);

  // High frequency sizzle — turbo whistle
  const turboOsc = ctx.createOscillator();
  turboOsc.type = 'sine';
  turboOsc.frequency.setValueAtTime(2000, now + 0.2);
  turboOsc.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
  turboOsc.frequency.exponentialRampToValueAtTime(3000, now + 1.0);
  turboOsc.frequency.linearRampToValueAtTime(2500, now + duration);

  const turboGain = ctx.createGain();
  turboGain.gain.setValueAtTime(0, now);
  turboGain.gain.linearRampToValueAtTime(0, now + 0.2);
  turboGain.gain.linearRampToValueAtTime(0.02, now + 0.5);
  turboGain.gain.setValueAtTime(0.02, now + 1.0);
  turboGain.gain.linearRampToValueAtTime(0, now + duration);

  turboOsc.connect(turboGain);
  turboGain.connect(master);
  turboOsc.start(now);
  turboOsc.stop(now + duration);
}

/**
 * UI click sound — subtle tactile feedback
 */
export function playClickSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Auth success chime — biometric verification complete
 */
export function playAuthSuccessSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — major chord arpeggio
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    const start = now + i * 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}
