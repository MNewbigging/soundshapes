import * as Tone from 'tone';
import { STBaseShapes } from './STBaseShapes';
import { SndFuncs } from './SndFuncs';
import { BeaterEffects } from '../common/types/shapes/Beater';

export class STSquare extends STBaseShapes
{
    private sqrSynth = new Tone.PolySynth(Tone.Synth);
    
    public TriggerImpact(shapeScale:number, impactStrength:number, effects:BeaterEffects[]) 
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
        const lowerfreq = 100;
        const upperfreq = 400;

        shapeScale *= 0.1; // sets shapescale at default of 1.0

        const freqs = SndFuncs.MakeChord(
            chordsize, chordsize+2, 
            lowerfreq/shapeScale, upperfreq/shapeScale, 
            50)
        console.log("Square freqs: " + freqs);
        
        this.sqrSynth.triggerAttackRelease(freqs, 0.25);

        // Modulates volume by impact magnitude.        
        this.shapeVol.volume.value = SndFuncs.clamp(1/chordsize + impactStrength*12, SndFuncs.minimum, 0);        
                
        // Creates signal chain.
        this.sqrSynth.chain(this.chorus, this.shapeVol);
    }
    
    



}