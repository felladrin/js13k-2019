import { GameHtmlElement } from "./GameHtmlElement";
import { GameSceneManager } from "./GameSceneManager";
import { Scene } from "../enum/Scene";
import { GameTopBar } from "./GameTopBar";
import { GameStreakManager } from "./GameStreakManager";
import { GamePlayScene } from "./GamePlayScene";
import { GameCountDownTimer } from "./GameCountDownTimer";
import { GameAudio } from "./GameAudio";
import { Random } from "./Random";
import { backgroundMusic } from "../const/backgroundMusic";
import { tokens } from "typed-inject";

export class GameListeners {
  public static inject = tokens("gameHtmlElement", "gameSceneManager", "gameTopBar", "gameStreakManager", "gamePlayScene", "gameCountDownTimer", "gameAudio");

  constructor(
    private gameHtmlElement: GameHtmlElement,
    private gameSceneManager: GameSceneManager,
    private gameTopBar: GameTopBar,
    private gameStreakManager: GameStreakManager,
    private gamePlayScene: GamePlayScene,
    private gameCountDownTimer: GameCountDownTimer,
    private gameAudio: GameAudio
  ) {}

  public initialize(): void {
    this.listenToBackToMenuClicks();
    // this.listenToButtonsHoversAndClicks();
    this.listenToCountDownTimerOver();
    this.listenToFirstInteractionToStartBackgroundMusic();
    this.listenToSceneChanges();
    this.listenToCorrectlyAnsweredQuestions();
    this.listenToWindowLoadToSetARandomBackground();
  }

  private listenToBackToMenuClicks(): void {
    Array.from(this.gameHtmlElement.backToMenuButtons).forEach(backToStartButton => {
      backToStartButton.addEventListener("click", () => {
        this.gameSceneManager.displayScene(Scene.Menu);
      });
    });
  }

  /*
  private listenToButtonsHoversAndClicks(): void {
    if (!window.AudioContext) return;

    const audioContext = new AudioContext();
    const buffer = audioContext.createBuffer(1, 96e3, 48e3);
    const channelData = buffer.getChannelData(0);
    const t: (i, n) => number = (i, n) => (n - i) / n;
    const n = 4e4;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(audioContext.destination);

    const clickSound: (i) => null | number = i =>
      i > n
        ? null
        : Math.sin(i / 8000 - Math.sin(i / 60) * Math.sin(i / 61)) * t(i, n);

    const hoverSound: (i) => null | number = i =>
      i > n
        ? null
        : Math.sin(i / 6000 - Math.sin(i / 90) * Math.sin(i / 91)) * t(i, n);

    Array.from(this.gameHtmlElement.allButtons).forEach(button => {
      button.addEventListener("click", () => {
        if (this.gameTopBar.isAudioDisabled()) return;
        for (let i = 96e3; i--; ) channelData[i] = clickSound(i);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start();
      });

      button.addEventListener("mouseenter", () => {
        if (this.gameTopBar.isAudioDisabled()) return;
        for (let i = 96e3; i--; ) channelData[i] = hoverSound(i);
        const s = audioContext.createBufferSource();
        s.buffer = buffer;
        s.connect(gainNode);
        s.start();
      });
    });
  }
  */

  private listenToSceneChanges(): void {
    this.gameSceneManager.onSceneDisplayed.addListener((scene: Scene) => {
      switch (scene) {
        case Scene.Menu:
          this.gameTopBar.displayNotification("Welcome! Ready to start?");
          break;
        case Scene.Tutorial:
          this.gameTopBar.displayNotification("Ah, finally someone here!");
          break;
        case Scene.About:
          this.gameTopBar.displayNotification("Curious, huh!?");
          break;
        case Scene.GamePlay:
          this.gameTopBar.displayNotification("Good Luck!");
          this.gameStreakManager.currentStreak = 0;
          this.gamePlayScene.preparePhase();
          this.gameCountDownTimer.start(10);
          break;
        case Scene.GameOver:
          this.gameTopBar.displayNotification("Oh no! Time's over!");
          break;
      }
    });
  }

  private listenToCountDownTimerOver(): void {
    this.gameCountDownTimer.onGamePlayCountDownTimeOver.addListener(() => {
      this.gameSceneManager.displayScene(Scene.GameOver);
    });
  }

  private listenToFirstInteractionToStartBackgroundMusic(): void {
    const startSong = (): void => {
      this.gameAudio.create(backgroundMusic, 0.2, true, true);
      document.removeEventListener("mousemove", startSong);
      document.removeEventListener("touchstart", startSong);
    };

    document.addEventListener("mousemove", startSong);
    document.addEventListener("touchstart", startSong);
  }

  private listenToWindowLoadToSetARandomBackground(): void {
    window.addEventListener("load", () => {
      this.gameHtmlElement.setBackgroundId(Random.pickIntInclusive(1, 4));
    });
  }

  private listenToCorrectlyAnsweredQuestions(): void {
    this.gamePlayScene.onAnsweredCorrectly.addListener(() => {
      this.gameStreakManager.increaseStreak();
      this.gameTopBar.displayNotification(
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
