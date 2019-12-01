import { GameListeners } from "./GameListeners";
import { GameCountDownTimer } from "./GameCountDownTimer";
import { GamePlayScene } from "./GamePlayScene";
import { GameTopBar } from "./GameTopBar";
import { GameStreakManager } from "./GameStreakManager";
import { GameMenu } from "./GameMenu";
import { GameSceneManager } from "./GameSceneManager";
import { tokens } from "typed-inject";

export class Game {
  public static inject = tokens(
    "gameTopBar",
    "gameStreakManager",
    "gameMenu",
    "gameSceneManager",
    "gamePlayScene",
    "gameCountDownTimer",
    "gameListeners"
  );

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
