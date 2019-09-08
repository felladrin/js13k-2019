/** @see https://stackoverflow.com/a/55699349 */
export function pickRandomElementFromEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
