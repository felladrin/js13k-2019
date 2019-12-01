import { gameName } from "../const/gameName";

type GameData = {
  longestStreak: number;
};

export class GameStorage {
  private memoryStorage: GameData = { longestStreak: 0 };

  public isLocalStorageAvailable(): boolean {
    try {
      const tempItem = Math.random().toString(36);
      localStorage.setItem(tempItem, tempItem);
      localStorage.removeItem(tempItem);
      return true;
    } catch (e) {
      return false;
    }
  }

  public save(data: GameData): void {
    if (!this.isLocalStorageAvailable()) {
      this.memoryStorage = data;
      return;
    }

    const gameDataAsString = JSON.stringify(data);
    const cipher = this.getCipher(gameName);
    const cipheredGameData = cipher(gameDataAsString);

    localStorage.setItem(gameName, cipheredGameData);
  }

  public load(): GameData {
    if (!this.isLocalStorageAvailable()) {
      return this.memoryStorage;
    }

    const cipheredGameData = localStorage.getItem(gameName);

    if (!cipheredGameData) return null;

    const decipher = this.getDecipher(gameName);
    const gameDataAsString = decipher(cipheredGameData);

    return JSON.parse(gameDataAsString);
  }

  /** @see https://stackoverflow.com/a/54026460 */
  private getCipher(salt: string): (text: string) => string {
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
  private getDecipher(salt: string): (encoded: string) => string {
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
