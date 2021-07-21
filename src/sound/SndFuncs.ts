import * as Tone from 'tone';

export class SndFuncs
{
    public static minimum = -80;

    public static MakeChord(chordMin:number, chordMax:number, noteMin:number, noteMax:number, interval:number) {
        const notes = <number[]>[];
        const notesLen = this.getRandomInt(chordMin, chordMax, 1);
        for (let i = 0; i < notesLen; ++i) {                
            const note = this.getRandomInt(noteMin, noteMax, interval);
            notes.push(note);
        }
        return notes;
    }
    
    public static getRandomInt(min:number, max:number, interval:number) {
        // original from https://gist.github.com/kerimdzhanov/7529623 
        // interval = spacing between return values, to make modes


        min /= interval;
        max /= interval;
        return this.clamp(interval * Math.floor(Math.random() * (max - min + 1) + min), interval*min, interval*max);
    }

    public static clamp(value:number, min:number, max:number){
        return Math.max(min, Math.min(value, max));
    }


}