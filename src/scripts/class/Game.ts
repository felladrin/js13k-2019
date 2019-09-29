import { GameCountDownTimer } from "./GameCountDownTimer";
import { GameSceneManager } from "./GameSceneManager";
import { GameMenu } from "./GameMenu";
import { GameTopBar } from "./GameTopBar";
import { GamePlayScene } from "./GamePlayScene";
import { GameStreakManager } from "./GameStreakManager";
import { GameListeners } from "./GameListeners";

export class Game {
  public static initialize(): void {
    GameTopBar.initialize();
    GameStreakManager.initialize();
    GameMenu.initialize();
    GameSceneManager.initialize();
    GamePlayScene.initialize();
    GameCountDownTimer.initialize();
    GameListeners.initialize();
  }
}
