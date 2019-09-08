import { CountDownTimer } from "./CountDownTimer";
import { SceneManager } from "./SceneManager";
import { Menu } from "./Menu";
import { Header } from "./Header";
import { GameAudio } from "./GameAudio";
import { backgroundMusic } from "../const/backgroundMusic";
import { GameSignal } from "./GameSignal";
import { Scene } from "../enum/Scene";
import { GamePlayScene } from "./GamePlayScene";

export class Game {
  static countDownTimer = new CountDownTimer(10);
  static sceneManager = new SceneManager();
  static menu = new Menu();
  static header = new Header();

  public static start(): void {
    this.header.displayNotification("<em>Welcome!</em>");
    this.startBackgroundMusicOnFirstInteraction();
    this.listenToSceneChanges();
  }

  private static listenToSceneChanges(): void {
    GameSignal.sceneDisplayed.add((scene: Scene) => {
      switch (scene) {
        case Scene.Menu:
          break;
        case Scene.Tutorial:
          break;
        case Scene.Credits:
          break;
        case Scene.GamePlay:
          this.header.displayNotification("<em>Good Luck!</em>");
          this.executeGamePlayLoop();
          break;
        case Scene.GameOver:
          break;
      }
    });
  }

  private static executeGamePlayLoop(): void {
    this.countDownTimer.reset();
    GamePlayScene.preparePhase();
    this.countDownTimer.start();
    // awaitUserResponse();
  }

  private static startBackgroundMusicOnFirstInteraction(): void {
    const startSong = (): void => {
      GameAudio.create(backgroundMusic, 0.2, true, true);
      document.removeEventListener("mousemove", startSong);
      document.removeEventListener("touchstart", startSong);
    };

    document.addEventListener("mousemove", startSong);
    document.addEventListener("touchstart", startSong);
  }
}
