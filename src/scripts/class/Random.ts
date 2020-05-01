export class Random {
  public static pickIndexFromLength(length: number): number {
    return Math.floor(Math.random() * length);
  }

  /** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
  public static pickIntInclusive(min: number, max: number): number {
    const minimalDifference = 1;
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + minimalDifference)) + Math.ceil(min);
  }

  public static pickElementFromArray<T>(arr: Array<T>): T {
    return arr[this.pickIndexFromLength(arr.length)];
  }

  /** @see https://stackoverflow.com/a/55699349 */
  public static pickElementFromEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = (Object.keys(anEnum)
        .map((num) => Number.parseInt(num, 10))
        .filter((num) => !Number.isNaN(num)) as unknown) as T[keyof T][],
      randomIndex = Math.floor(Math.random() * enumValues.length);
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
