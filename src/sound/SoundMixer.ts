import * as Tone from 'tone';

// todo: have a single soundmixer object with a master/mixer volume.
// Q: how to instantiate at start then have everything reference this while keeping only one of them?

class SoundMixer {
  public master = new Tone.Channel().toDestination();

  public shapes = new Tone.Channel().connect(this.master);
  public ui = new Tone.Channel().connect(this.master);
}

/**
 * A: By removing the 'export' from above class, it cannot be instantiated by other classes.
 * Instead, we instantiate it once here, assigned to a variable 'soundMixer' and export that
 * variable instead. This means there'll only ever be one of these classes, and since it's
 * been exported we can access it from anywhere!
 *
 * To note - while this isn't used yet, worth looking at how and where it'll be used to determine
 * if a singleton is really the best call for this.
 */
export const soundMixer = new SoundMixer();
