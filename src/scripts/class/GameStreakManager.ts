import { GameStorage } from "./GameStorage";
import { GameHtmlElement } from "./GameHtmlElement";
import { GamePlayScene } from "./GamePlayScene";

export class GameStreakManager {
  static get currentStreak(): number {
    return this._currentStreak;
  }

  static set currentStreak(value: number) {
    this._currentStreak = value;
    Array.from(GameHtmlElement.currentStreakElements).forEach(
      currentStreakElement => {
        currentStreakElement.innerText = this._currentStreak.toString();
      }
    );
    this.longestStreak = Math.max(this.currentStreak, this.longestStreak);
  }

  static get longestStreak(): number {
    return this._longestStreak;
  }

  static set longestStreak(value: number) {
    if (value == this._longestStreak) return;
    this._longestStreak = value;
    Array.from(GameHtmlElement.longestStreakElements).forEach(
      longestStreakElement => {
        longestStreakElement.innerText = this._longestStreak.toString();
      }
    );
    GameStorage.save({ longestStreak: this._longestStreak });
  }

  private static _currentStreak = 0;
  private static _longestStreak = 0;

  public static initialize(): void {
    const gameData = GameStorage.load();

    if (gameData) this.longestStreak = gameData.longestStreak;

    GamePlayScene.onAnsweredCorrectly.add(() => this.currentStreak++);
  }
}
