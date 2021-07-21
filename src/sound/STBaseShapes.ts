import * as Tone from 'tone';


export class STBaseShapes 
{
    // Base Class for Sound Triggers (Shapes)

    public size = 1;
    public outputVol = new Tone.Volume(-24).toDestination();
    public shapeVol = new Tone.Volume(0).connect(this.outputVol);
    

    // FX //
    public tremolo = new Tone.Tremolo(7, 0.9).start().connect(this.outputVol);
    public chorus = new Tone.Chorus(4, 2.5, 0.3).start().connect(this.outputVol);
    public reverb = new Tone.Reverb(3).connect(this.outputVol);

    

}