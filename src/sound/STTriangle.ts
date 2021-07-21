import * as Tone from 'tone';
import { SndFuncs } from './SndFuncs';
import { STBaseShapes } from './STBaseShapes';

export class STTriangle extends STBaseShapes
{
    private membraneSynth = new Tone.PolySynth(Tone.MembraneSynth);    

    public TriggerImpact(magnitude:number) {
        const synth = this.membraneSynth;
        const chordsize = 3;
        const baseFreq = 100;
        // Modulates volume by impact magnitude.        
        this.shapeVol.volume.value = 1/chordsize + magnitude*12;
        
        const freqs = SndFuncs.MakeChord(chordsize, chordsize, baseFreq/this.size, (baseFreq*1.5)/this.size, 33);
        console.log("Triangle freqs: " + freqs);

        synth.triggerAttackRelease(freqs, 0.66);
        synth.chain(this.chorus, this.shapeVol);

        
    }

}