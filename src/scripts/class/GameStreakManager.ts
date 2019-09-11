import { GameStorage } from "./GameStorage";

export class GameStreakManager {
  public static currentStreak = 0;
  public static longestStreak = 0;

  public static initialize(): void {
    const gameData = GameStorage.load();
    if (gameData) this.longestStreak = gameData.longestStreak;
  }
}
