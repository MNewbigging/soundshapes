import * as Tone from 'tone';

import { BeaterEffects } from '../common/types/shapes/Beater';
import { STBaseShapes } from './STBaseShapes';

export class STCircle extends STBaseShapes {
  public triggerImpact(shapeScale: number, impactStrength: number, beater: BeaterEffects[]) {
    // impactStrength lowers pitch, and increases volume and density.
    const baseFreq = 400;
    const notes = 3 + Math.floor(impactStrength * 5);

    // Create single sine at base frequency.
    this.makeSine(shapeScale, baseFreq, 1);

    const freqs: number[] = [];
    freqs.push(baseFreq);

    // Add in other sines around base frequency for wobble.
    for (let i = 0; i < notes; ++i) {
      let jitter = 30;
      jitter = jitter / 2 - Math.floor(Math.random() * jitter);
      const freq = baseFreq + jitter;
      this.makeSine(shapeScale, freq, notes);

      freqs.push(freq);
    }

    console.log('circle freqs: ' + freqs);
    this.shapeVol.volume.value = 1 / notes + impactStrength * 12;
  }

  private makeSine(shapeSize: number, freq: number, chordsize: number) {
    // Create envelope
    const ampEnv = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.5,
      sustain: 0.9,
      release: 4,
    });

    // Reduce by chord size
    const impactGain = new Tone.Gain(1 / (chordsize + 1));

    // Create a new oscillator, start and apply envelope
    let sineOsc = new Tone.Oscillator();
    sineOsc.set({
      type: 'sine3',
      frequency: freq / shapeSize,
    });
    sineOsc.start();
    ampEnv.triggerAttackRelease(0.5);

    // Destroy oscillator when finished
    const t = (ampEnv.attack as number) + (ampEnv.decay as number) + (ampEnv.release as number);
    setTimeout(() => {
      sineOsc.dispose();
    }, 1000 * t);

    // Set chain
    sineOsc.chain(ampEnv, impactGain, this.chorus, this.tremolo, this.shapeVol);
  }
}
