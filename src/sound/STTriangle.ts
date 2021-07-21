import * as Tone from 'tone';
import { BeaterEffects } from '../common/types/shapes/Beater';
import { SndFuncs } from './SndFuncs';
import { STBaseShapes } from './STBaseShapes';

export class STTriangle extends STBaseShapes
{
    private membraneSynth = new Tone.PolySynth(Tone.MembraneSynth);    

    public TriggerImpact(shapeScale:number, impactStrength:number, effects:BeaterEffects[]) {
        const synth = this.membraneSynth;
        const chordsize = 3;
        const baseFreq = 100;
        // Modulates volume by impact magnitude.        
        this.shapeVol.volume.value = 1/chordsize + impactStrength*12;
        
        const freqs = SndFuncs.MakeChord(chordsize, chordsize, baseFreq/shapeScale, (baseFreq*1.5)/shapeScale, 33);
        console.log("Triangle freqs: " + freqs);

        synth.triggerAttackRelease(freqs, 0.66);
        synth.chain(this.chorus, this.shapeVol);

        
    }

}