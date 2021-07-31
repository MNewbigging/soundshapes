import * as Tone from 'tone';
import { STBaseShapes } from './STBaseShapes';
import { SoundUtils } from './SoundUtils';
import { BeaterEffects } from '../common/types/shapes/Beater';

export class STSquare extends STBaseShapes {
  private sqrSynth = new Tone.PolySynth(Tone.Synth);
  private baseFreq = 250;
  private baseAttack = 0.025;
  private baseDecay = 0.25;
  private baseRelease = 0.5;
  private basePartials = 4;

  constructor() {
    super();
    this.sqrSynth.set({
      oscillator: {
        type: 'square4',
      },
      envelope: {
        attack: this.baseAttack,
        decay: this.baseDecay,
        sustain: Tone.dbToGain(-12),
        release: this.baseRelease,
      },
    });
  }

  public triggerImpact(shapeScale: number, impactStrength: number, effects: BeaterEffects[]) {
    const synth = this.sqrSynth;
    let asdrScale = impactStrength * 0.2; // iS is roughly 1-15 at the moment, so this scales down to a better level for me

    synth.set({
      envelope: {
        // higher impact strength = quicker attack, longer release
        attack: this.baseAttack / (asdrScale / 2),
        decay: this.baseDecay * asdrScale,
        release: this.baseRelease * (asdrScale * 2),
      },
      oscillator: {
        // higher impact strength = adds partials
        partialCount: Math.round(SoundUtils.clamp(this.basePartials * asdrScale, 0, 32)),
      },
    });

    const chordSize = Math.round(shapeScale);
    let freqs = SoundUtils.makeChord(
      chordSize,
      chordSize,
      this.baseFreq / shapeScale,
      (this.baseFreq * 2) / shapeScale,
      50
    );

    // impact strength => velocity
    let velocity = SoundUtils.clamp(1 - 1.5 / impactStrength, 0.4, 1);
    synth.triggerAttackRelease(freqs, 0.25 * asdrScale, Tone.now(), velocity);

    // Creates signal chain.
    synth.chain(this.chorus, this.shapeVol);

    console.log(
      'impact triggered on STSquare object. shapeScale: ' +
        shapeScale +
        ' | impactStrength: ' +
        impactStrength +
        ' | effects: ' +
        effects +
        '. \n Frequency: ' +
        freqs +
        ' | velocity: ' +
        velocity
    );
  }
}
