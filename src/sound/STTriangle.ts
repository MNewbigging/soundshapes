import * as Tone from 'tone';

import { BeaterEffects } from '../common/types/shapes/Beater';
import { SoundUtils } from './SoundUtils';
import { STBaseShapes } from './STBaseShapes';

export class STTriangle extends STBaseShapes {
  private membraneSynth = new Tone.PolySynth(Tone.MembraneSynth);
  private baseFreq = 150;

  public triggerImpact(shapeScale: number, impactStrength: number, effects: BeaterEffects[]) {
    const synth = this.membraneSynth;

    let lowerfreq = this.baseFreq / shapeScale;
    let upperfreq = (this.baseFreq * 1.5) / shapeScale;
    let freq = SoundUtils.getRandomInt(lowerfreq, upperfreq, 33);

    // impact strength => velocity
    let velocity = SoundUtils.clamp(1 - 2 / impactStrength, 0.1, 1);
    synth.triggerAttackRelease(freq, 0.1, Tone.now(), velocity);

    // Creates signal chain.
    synth.chain(this.chorus, this.shapeVol);

    console.log(
      'impact triggered on STTriangle object. shapeScale: ' +
        shapeScale +
        ' | impactStrength: ' +
        impactStrength +
        ' | effects: ' +
        effects +
        '. \nFrequency: ' +
        freq +
        ' | velocity: ' +
        velocity
    );
  }
}
