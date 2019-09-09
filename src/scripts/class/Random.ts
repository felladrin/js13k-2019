export class Random {
  public static pickIndexFromLength(length: number): number {
    return Math.floor(Math.random() * length);
  }

  /** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
  public static pickIntInclusive(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
