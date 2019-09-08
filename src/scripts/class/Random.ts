export class Random {
  public static pickElementFromArray<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /** @see https://stackoverflow.com/a/55699349 */
  public static pickElementFromEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = (Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
}
