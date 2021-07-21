import * as Tone from 'tone';
import { STBaseShapes } from './STBaseShapes';
import { SndFuncs } from './SndFuncs';
import { BeaterEffects } from '../common/types/shapes/Beater';
import { Type } from 'typescript';
import { ToneOscillatorInterface } from 'tone/build/esm/source/oscillator/OscillatorInterface';

export class STSquare extends STBaseShapes
{    
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
        })
    }
    
    public TriggerImpact(shapeScale:number, impactStrength:number, effects:BeaterEffects[]) 
    {
        console.log("impact triggered on STSquare object. shapeScale: " + shapeScale + " | impactStrength: " + impactStrength + " | effects: " + effects);
    
        let asdrScale = impactStrength * 0.1; // iS is roughly 1-15 at the moment, so this scales down to a better level for me
        
        this.sqrSynth.set({
            envelope: {
                // higher impact strength = quicker attack, longer release
                attack: this.baseAttack / (asdrScale / 2),
                decay: this.baseDecay * asdrScale,
                release: this.baseRelease * (asdrScale),
            },
            oscillator: {
                // higher impact strength = adds partials
                partialCount: Math.round(SndFuncs.clamp(this.basePartials * (2*asdrScale), 0, 32)),
            }
        })
        
        const chordSize = shapeScale;

        let freqs = SndFuncs.MakeChord(chordSize, chordSize,
             this.baseFreq / shapeScale, 
             (this.baseFreq * 2) / shapeScale,
             50)
        console.log("square freqs: " + freqs);
       
        this.sqrSynth.triggerAttackRelease(freqs, 0.25 * asdrScale);

        // Modulates volume by impact magnitude.        
        this.shapeVol.volume.value = SndFuncs.clamp(impactStrength, SndFuncs.minimum, 0);        
                
        // Creates signal chain.
        this.sqrSynth.chain(this.chorus, this.shapeVol);
    }
}