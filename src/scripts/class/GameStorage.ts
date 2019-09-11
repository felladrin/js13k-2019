import { gameName } from "../const/gameName";

type GameData = {
  longestStreak: number;
};

export class GameStorage {
  public static save(data: GameData): void {
    const gameDataAsString = JSON.stringify(data);
    const cipher = this.getCipher(gameName);
    const cipheredGameData = cipher(gameDataAsString);
    localStorage.setItem(gameName, cipheredGameData);
  }

  public static load(): GameData {
    const cipheredGameData = localStorage.getItem(gameName);
    const decipher = this.getDecipher(gameName);
    const gameDataAsString = decipher(cipheredGameData);
    return JSON.parse(gameDataAsString);
  }

  /** @see https://stackoverflow.com/a/54026460 */
  private static getCipher(salt: string): (text: string) => string {
    const textToChars: (text) => number[] = text =>
      text.split("").map(c => c.charCodeAt(0));

    const byteHex: (n) => string = n =>
      ("0" + Number(n).toString(16)).substr(-2);

    const applySaltToChar: (code) => number = code =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text: string): string =>
      text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
  }

  /** @see https://stackoverflow.com/a/54026460 */
  private static getDecipher(salt: string): (encoded: string) => string {
    const textToChars: (text) => number[] = text =>
      text.split("").map(c => c.charCodeAt(0));

    const applySaltToChar: (code) => number = code =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded: string): string =>
      encoded
        .match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join("");
  }
}
