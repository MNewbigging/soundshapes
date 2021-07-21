import * as Tone from 'tone';

// todo: have a single soundmixer object with a master/mixer volume.
// Q: how to instantiate at start then have everything reference this while keeping only one of them?


export class SoundMixer 
{
    public master = new Tone.Channel().toDestination();

    public shapes = new Tone.Channel().connect(this.master);
    public ui = new Tone.Channel().connect(this.master);


}