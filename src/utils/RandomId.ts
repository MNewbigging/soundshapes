export class RandomId {
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
}
