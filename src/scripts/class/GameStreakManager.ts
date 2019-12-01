import { GameStorage } from "./GameStorage";
import { GameHtmlElement } from "./GameHtmlElement";
import { tokens } from "typed-inject";

export class GameStreakManager {
  public static inject = tokens("gameStorage", "gameHtmlElement");

  constructor(
    private gameStorage: GameStorage,
    private gameHtmlElement: GameHtmlElement
  ) {}

  private _currentStreak = 0;

  get currentStreak(): number {
    return this._currentStreak;
  }

  set currentStreak(value: number) {
    this._currentStreak = value;
    Array.from(this.gameHtmlElement.currentStreakElements).forEach(
      currentStreakElement => {
        currentStreakElement.innerText = this._currentStreak.toString();
      }
    );
    this.longestStreak = Math.max(this.currentStreak, this.longestStreak);
  }

  private _longestStreak = 0;

  get longestStreak(): number {
    return this._longestStreak;
  }

  set longestStreak(value: number) {
    if (value == this._longestStreak) return;
    this._longestStreak = value;
    Array.from(this.gameHtmlElement.longestStreakElements).forEach(
      longestStreakElement => {
        longestStreakElement.innerText = this._longestStreak.toString();
      }
    );
    this.gameStorage.save({ longestStreak: this._longestStreak });
  }

  public initialize(): void {
    const gameData = this.gameStorage.load();

    if (gameData) this.longestStreak = gameData.longestStreak;
  }

  public increaseStreak(): void {
    this.currentStreak++;
  }
}
