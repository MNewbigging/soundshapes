import * as Tone from 'tone';
import { STBaseShapes } from './STBaseShapes';

export class STCircle extends STBaseShapes
{
    public TriggerImpact(magnitude:number) {
        // Impact magnitude lowers pitch, and increases volume and density.
        const baseFreq = 400;
        const notes = 3 + Math.floor(magnitude*5);

        const freqs = <number[]>[];
        
        this.MakeSine(this.size, baseFreq, 1);
        freqs.push(baseFreq);
        
        for (let i = 0; i < notes; ++i) {
            let  jitter = 30;
            jitter = (jitter / 2) - (Math.floor( Math.random() * jitter));
            const freq = baseFreq + jitter;
            this.MakeSine(this.size, freq, notes);

            freqs.push(freq);
        }
        console.log("circle freqs: " + freqs);
        this.shapeVol.volume.value = 1/notes + magnitude*12;
        

    }

    private MakeSine (shapeSize:number, freq:number, chordsize:number) {               
        
        // Create envelope
        const ampEnv = new Tone.AmplitudeEnvelope({
            attack: 0.1,
            decay: 0.5,
            sustain: 0.9,
            release: 4
        });

        // Reduce by chord size
        const impactGain = new Tone.Gain(1 / (chordsize + 1));

        // Create a new oscillator, start and apply envelope
        let sineOsc = new Tone.Oscillator();
        sineOsc.set ({
            type: 'sine3',
            frequency: freq / shapeSize
        })
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


