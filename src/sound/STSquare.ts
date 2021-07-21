import * as Tone from 'tone';
import { STBaseShapes } from './STBaseShapes';
import { SndFuncs } from './SndFuncs';

export class STSquare extends STBaseShapes
{
    private sqrSynth = new Tone.PolySynth(Tone.Synth);
    
    public TriggerImpact(magnitude:number) 
    {
        // magnitude: 0-1
        this.sqrSynth.set({
            oscillator: {
                type: 'square6',
            },
            envelope: {
                attack: 0.025,
                decay: 0.25,
                sustain: Tone.dbToGain(-12),
                release: 0.5
                
            }
            
        })
        // Creates a chord with given parameters.
        const chordsize = 4;
        const freqs = SndFuncs.MakeChord(chordsize, chordsize, 100/this.size, 400/this.size, 50)
        console.log("Square freqs: " + freqs);
        
        this.sqrSynth.triggerAttackRelease(freqs, 0.25);

        // Modulates volume by impact magnitude.        
        this.shapeVol.volume.value = 1/chordsize + magnitude*12;        
        this.sqrSynth.chain(this.chorus, this.shapeVol);
    }
    
    



}