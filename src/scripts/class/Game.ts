import { tokens } from "typed-inject";
import { GameCountDownTimer } from "./GameCountDownTimer";
import { GameListeners } from "./GameListeners";
import { GameMenu } from "./GameMenu";
import { GamePlayScene } from "./GamePlayScene";
import { GameSceneManager } from "./GameSceneManager";
import { GameStreakManager } from "./GameStreakManager";
import { GameTopBar } from "./GameTopBar";

export class Game {
  public static inject = tokens("gameTopBar", "gameStreakManager", "gameMenu", "gameSceneManager", "gamePlayScene", "gameCountDownTimer", "gameListeners");

  constructor(
    private gameTopBar: GameTopBar,
    private gameStreakManager: GameStreakManager,
    private gameMenu: GameMenu,
    private gameSceneManager: GameSceneManager,
    private gamePlayScene: GamePlayScene,
    private gameCountDownTimer: GameCountDownTimer,
    private gameListeners: GameListeners
  ) {}

  public initialize(): void {
    this.gameTopBar.initialize();
    this.gameStreakManager.initialize();
    this.gameMenu.initialize();
    this.gameSceneManager.initialize();
    this.gamePlayScene.initialize();
    this.gameCountDownTimer.initialize();
    this.gameListeners.initialize();
  }
}
