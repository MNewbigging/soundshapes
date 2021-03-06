import * as Tone from 'tone';

import { RandomUtils } from '../utils/RandomUtils';
import { SoundUtils } from './SoundUtils';
import { STBaseShapes } from './STBaseShapes';

// Beater vs. Beater collision

export class STBeater extends STBaseShapes {
  private click = new Tone.PluckSynth();
  private metalsynth = new Tone.MetalSynth();
  private baseFreq = 160;

  constructor() {
    super();
    this.click.set({
      resonance: 0.5,
    });
  }

  public triggerImpact(shapeScale: number, impactStrength: number) {
    console.log('impact on stbeater with impact strength of ' + impactStrength);
    const synth1 = this.click;
    const synth2 = this.metalsynth;

    const asdrScale = impactStrength * 0.1;
    synth1.set({
      resonance: RandomUtils.clamp(asdrScale / 2, 0, 1),
    });
    synth2.set({
      envelope: {
        attack: 0.1 / asdrScale,
        release: 0.2 * asdrScale,
      },
    });

    let lowerfreq = this.baseFreq / shapeScale;
    let upperfreq = (this.baseFreq * 1.5) / shapeScale;
    let freq = SoundUtils.getRandomInt(lowerfreq, upperfreq, 33);

    let velocity = RandomUtils.clamp(1 - 2 / impactStrength, 0.1, 1);
    synth1.triggerAttackRelease(freq, 0.1, Tone.now(), velocity);
    synth2.triggerAttackRelease(freq, 0.1, Tone.now(), velocity / 2);

    // set chain
    synth1.chain(this.chorus, this.shapeVol);
    synth2.chain(this.chorus, this.shapeVol);
  }
}
