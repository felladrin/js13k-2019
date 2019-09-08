export function pickRandomElementFromArray<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}
