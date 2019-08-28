import "./index.scss";

enum Scene {
  Menu = "Menu",
  Tutorial = "Tutorial",
  Credits = "Credits",
  GamePlay = "GamePlay",
  GameOver = "GameOver"
}

class SceneManager {
  public currentScene: Scene = Scene.Menu;

  constructor() {
    SceneManager.displayScene(this.currentScene);
  }

  static displayScene(scene: Scene): void {
    for (const sceneKey in Scene) {
      const sceneElement = SceneManager.getSceneElement(Scene[sceneKey]);
      if (scene == sceneKey) {
        sceneElement.classList.remove("inactive");
      } else {
        sceneElement.classList.add("inactive");
      }
    }
  }

  static getSceneElement(scene: string): HTMLDivElement {
    return document.querySelector(`div[data-scene="${scene}"]`);
  }
}

enum GamePlayState {
  PresentingPhaseInfo,
  FadingInScene,
  AwaitingUserResponse,
  CongratulatingPlayer
}

class GamePlayStateManager {
  public currentState: GamePlayState = GamePlayState.PresentingPhaseInfo;
}

class CountDownTimer {
  private count = 0;
  private intervalTimerId = 0;

  private static readonly ONE_SECOND = 1000;

  constructor(private initialCount: number, private onTimeOver: () => void) {
    this.reset();
  }

  public reset(): void {
    this.count = this.initialCount;
  }

  public start(): void {
    this.intervalTimerId = setInterval(
      this.handleTimeout,
      CountDownTimer.ONE_SECOND
    );
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
  }

  private handleTimeout(): void {
    this.count--;

    if (this.count == 0) {
      this.stop();
      this.onTimeOver();
    }
  }
}

class Game {
  countDownTimer: CountDownTimer;
  sceneManager: SceneManager;

  public start(): void {
    this.countDownTimer = new CountDownTimer(10, (): void => {});
    this.sceneManager = new SceneManager();
  }

  public loop(): void {
    this.countDownTimer.reset();
    // fadeInSentence();
    // fadeInQuestion();
    // fadeInOptions();
    this.countDownTimer.start();
    // awaitUserResponse();
  }
}

new Game().start();

class Carousel {
  carousel: HTMLDivElement;
  cellCount = 3;
  selectedIndex = 0;

  constructor() {
    this.carousel = document.querySelector(".carousel");

    const prevButton = document.querySelector(".previous-button");
    prevButton.addEventListener("click", () => {
      this.selectedIndex--;
      this.rotate();
    });

    const nextButton = document.querySelector(".next-button");
    nextButton.addEventListener("click", () => {
      this.selectedIndex++;
      this.rotate();
    });
  }

  rotate(): void {
    const angle = (this.selectedIndex / this.cellCount) * -360;
    this.carousel.style.transform =
      "translateZ(-288px) rotateY(" + angle + "deg)";
  }
}

new Carousel();
