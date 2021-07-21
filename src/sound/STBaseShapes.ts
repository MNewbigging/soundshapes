import * as Tone from 'tone';


export class STBaseShapes 
{
    // Base Class for Sound Triggers (Shapes)
    public outputVol = new Tone.Volume(-12).toDestination();
    public shapeVol = new Tone.Volume(0).connect(this.outputVol);
    

    // FX //
    public tremolo = new Tone.Tremolo(7, 0.9).start();
    public chorus = new Tone.Chorus(4, 2.5, 0.3).start();
    public reverb = new Tone.Reverb(3);

    

}