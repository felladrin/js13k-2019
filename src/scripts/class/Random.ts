export class Random {
  public static pickIndexFromLength(length: number): number {
    return Math.floor(Math.random() * length);
  }

  public static pickCharFromString(str: string): string {
    return str[this.pickIndexFromLength(str.length)];
  }

  public static pickElementFromArray<T>(arr: Array<T>): T {
    return arr[this.pickIndexFromLength(arr.length)];
  }

  /** @see https://stackoverflow.com/a/55699349 */
  public static pickElementFromEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = (Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }

  /** @see https://stackoverflow.com/a/6274381 */
  public static shuffle<T>(arr: Array<T>): Array<T> {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
