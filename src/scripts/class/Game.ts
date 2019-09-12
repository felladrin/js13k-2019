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
import { GameStreakManager } from "./GameStreakManager";
import { Random } from "./Random";

export class Game {
  public static initialize(): void {
    GameTopBar.initialize();
    GameStreakManager.initialize();
    GameMenu.initialize();
    GameSceneManager.initialize();
    GamePlayScene.initialize();
    GameCountDownTimer.initialize();

    GameTopBar.displayNotification("<em>Welcome!</em>");

    GameHtmlElement.setBackgroundId(Random.pickIntInclusive(1, 4));

    this.startBackgroundMusicOnFirstInteraction();
    this.listenToSceneChanges();
    this.listenToBackToMenuClicks();
    this.listenToButtonsHoversAndClicks();
    this.listenToCountDownTimerOver();
  }

  private static listenToBackToMenuClicks(): void {
    Array.from(GameHtmlElement.backToMenuButtons).forEach(backToStartButton => {
      backToStartButton.addEventListener("click", () => {
        GameSceneManager.displayScene(Scene.Menu);
      });
    });
  }

  private static listenToButtonsHoversAndClicks(): void {
    Array.from(GameHtmlElement.allButtons).forEach(button => {
      button.addEventListener("click", () => {
        GameSignal.buttonPressed.emit();
      });

      button.addEventListener("mouseenter", () => {
        GameSignal.buttonHovered.emit();
      });
    });
  }

  private static listenToSceneChanges(): void {
    GameSignal.sceneDisplayed.add((scene: Scene) => {
      switch (scene) {
        case Scene.Menu:
          GameTopBar.displayNotification("Ready to start!?");
          break;
        case Scene.Tutorial:
          GameTopBar.displayNotification("Ah, finally someone here!");
          break;
        case Scene.About:
          GameTopBar.displayNotification("Curious, huh!?");
          break;
        case Scene.GamePlay:
          GameTopBar.displayNotification("Good Luck!");
          GamePlayScene.preparePhase();
          GameCountDownTimer.start(10);
          break;
        case Scene.GameOver:
          GameTopBar.displayNotification("Oh no!!! =(");
          break;
      }
    });
  }

  private static listenToCountDownTimerOver(): void {
    GameSignal.gamePlayCountDownTimeOver.add(() => {
      GameSceneManager.displayScene(Scene.GameOver);
    });
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
