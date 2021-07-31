export class RandomUtils {
  private static readonly characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  private static readonly idLength = 5;

  public static createId(): string {
    let id = '';
    const max = this.characters.length;
    for (let i = 0; i < this.idLength; i++) {
      id += this.characters.charAt(Math.floor(Math.random() * max));
    }
    return id;
  }

  public static getRandomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static getRandomInterval(min: number, max: number, interval: number) {
    const value = RandomUtils.getRandomRange(min, max) / interval;
  }

  public static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
}
