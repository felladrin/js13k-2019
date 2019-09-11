import { GameCountDownTimer } from "./GameCountDownTimer";
import { GameSceneManager } from "./GameSceneManager";
import { GameMenu } from "./GameMenu";
import { GameTopBar } from "./GameTopBar";
import { GameAudio } from "./GameAudio";
import { backgroundMusic } from "../const/backgroundMusic";
import { GameSignal } from "./GameSignal";
import { Scene } from "../enum/Scene";
import { GamePlayScene } from "./GamePlayScene";
import { GameHtmlElement } from "./GameHtmlElement";

export class Game {
  static countDownTimer = new GameCountDownTimer(10);
  static header = new GameTopBar();

  public static initialize(): void {
    GameMenu.initialize();
    GameSceneManager.initialize();
    this.header.displayNotification("<em>Welcome!</em>");
    this.startBackgroundMusicOnFirstInteraction();
    this.listenToSceneChanges();
    this.listenToAnswersSelected();
    this.listenToBackToMenuClicks();
  }

  private static listenToAnswersSelected(): void {
    Array.from(GameHtmlElement.answerButtons).forEach(answerButton => {
      answerButton.addEventListener("click", () => {
        GameSignal.answerSelected.emit(answerButton.innerText);
      });
    });
  }

  private static listenToBackToMenuClicks(): void {
    Array.from(GameHtmlElement.backToMenuButtons).forEach(backToStartButton => {
      backToStartButton.addEventListener("click", () => {
        GameSceneManager.displayScene(Scene.Menu);
      });
    });
  }

  private static listenToSceneChanges(): void {
    GameSignal.sceneDisplayed.add((scene: Scene) => {
      switch (scene) {
        case Scene.Menu:
          GameHtmlElement.setBackgroundId(1);
          this.header.displayNotification("Ready to start!?");
          break;
        case Scene.Tutorial:
          GameHtmlElement.setBackgroundId(4);
          this.header.displayNotification("Ah, finally someone here!");
          break;
        case Scene.About:
          GameHtmlElement.setBackgroundId(3);
          this.header.displayNotification("Curious, huh!?");
          break;
        case Scene.GamePlay:
          GameHtmlElement.setBackgroundId(2);
          this.header.displayNotification("Good Luck!");
          this.executeGamePlayLoop();
          break;
        case Scene.GameOver:
          GameHtmlElement.setBackgroundId(1);
          this.header.displayNotification("Oh no!!! =(");
          break;
      }
    });
  }

  private static executeGamePlayLoop(): void {
    this.countDownTimer.reset();
    GamePlayScene.preparePhase();
    this.countDownTimer.start();
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
