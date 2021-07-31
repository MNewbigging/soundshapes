import { RandomUtils } from '../utils/RandomUtils';

export class SoundUtils {
  // 0 refs, can this be removed?
  public static minimum = -80;

  // currently this is called where chordMin and chordMax are the same number,
  // will that always be the case?
  public static makeChord(
    chordMin: number,
    chordMax: number,
    noteMin: number,
    noteMax: number,
    interval: number
  ): number[] {
    const notes: number[] = [];
    //const notesLen = this.getRandomInt(chordMin, chordMax, 1);
    const notesLen = RandomUtils.getRandomRange(chordMin, chordMax);
    for (let i = 0; i < notesLen; i++) {
      const note = this.getRandomInt(noteMin, noteMax, interval);
      notes.push(note);
    }
    return notes;
  }

  public static getRandomInt(min: number, max: number, interval: number): number {
    // original from https://gist.github.com/kerimdzhanov/7529623
    // interval = spacing between return values, to make modes

    // I don't think your interval logic is correct here; you divide by interval
    // but then multiply by it later so it cancels out your initial division:

    /**
     * Let's say function is called with:
     * min = 6, max = 12, interval = 2
     *
     * min /= 2 => 3
     * max /= 2 => 6
     *
     * value = between 3 and 6, multiplied by 2 which equals between 6 and 12
     *
     * I think you want to first get the random number in the min/max range and
     * then divide that by interval. But, you'd probably not want to clamp it,
     * because chances are that by dividing by interval it'll be smaller than
     * the min value and clamp would just always return min instead of value...
     *
     * I've written an alternative in RandomUtils.getRandomInterval - test with
     * that and see if that does what you need.
     */

    min /= interval;
    max /= interval;

    const value = RandomUtils.getRandomRange(min, max);

    return this.clamp(interval * value, interval * min, interval * max);
  }

  public static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
}
