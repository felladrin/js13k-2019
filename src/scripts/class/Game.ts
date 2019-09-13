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
    this.listenToCountDownTimerOver();
    this.startBackgroundMusicOnFirstInteraction();
    this.listenToSceneChanges();
    this.listenToBackToMenuClicks();
    this.listenToButtonsHoversAndClicks();
    this.listenToCorrectlyAnsweredQuestions();
    this.setRandomBackground();
  }

  private static listenToBackToMenuClicks(): void {
    Array.from(GameHtmlElement.backToMenuButtons).forEach(backToStartButton => {
      backToStartButton.addEventListener("click", () => {
        GameSceneManager.displayScene(Scene.Menu);
      });
    });
  }

  private static listenToButtonsHoversAndClicks(): void {
    const audioContext = new AudioContext();
    const buffer = audioContext.createBuffer(1, 96e3, 48e3);
    const channelData = buffer.getChannelData(0);
    const t: (i, n) => number = (i, n) => (n - i) / n;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(audioContext.destination);

    const clickSound: (i) => null | number = function(i) {
      const n = 4e4;
      if (i > n) return null;
      return Math.sin(i / 8000 - Math.sin(i / 60) * Math.sin(i / 61)) * t(i, n);
    };

    const hoverSound: (i) => null | number = function(i) {
      const n = 4e4;
      if (i > n) return null;
      return Math.sin(i / 6000 - Math.sin(i / 90) * Math.sin(i / 91)) * t(i, n);
    };

    Array.from(GameHtmlElement.allButtons).forEach(button => {
      button.addEventListener("click", () => {
        if (GameTopBar.isAudioDisabled()) return;
        for (let i = 96e3; i--; ) channelData[i] = clickSound(i);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start();
      });

      button.addEventListener("mouseenter", () => {
        if (GameTopBar.isAudioDisabled()) return;
        for (let i = 96e3; i--; ) channelData[i] = hoverSound(i);
        const s = audioContext.createBufferSource();
        s.buffer = buffer;
        s.connect(gainNode);
        s.start();
      });
    });
  }

  private static listenToSceneChanges(): void {
    GameSignal.sceneDisplayed.add((scene: Scene) => {
      switch (scene) {
        case Scene.Menu:
          GameTopBar.displayNotification("Welcome! Ready to start?");
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
          GameTopBar.displayNotification("Oh no! Time's over!");
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

  private static setRandomBackground(): void {
    GameHtmlElement.setBackgroundId(Random.pickIntInclusive(1, 4));
  }

  private static listenToCorrectlyAnsweredQuestions(): void {
    GameSignal.answeredCorrectly.add(() => {
      GameTopBar.displayNotification(
        Random.pickElementFromArray([
          "Awesome!",
          "Perfect!",
          "Amazing!",
          "Outstanding!",
          "Splendid!",
          "Marvelous!",
          "Superb!",
          "Fabulous!",
          "Fantastic!",
          "Phenomenal!",
          "Wonderful!"
        ])
      );
    });
  }
}
