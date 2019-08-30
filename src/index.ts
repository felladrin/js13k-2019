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
  menuCarousel: HTMLDivElement;
  prevButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  cellCount: number;
  selectedIndex = 0;

  constructor() {
    this.queryElements();
    this.addEventListeners();
    this.cellCount = this.menuCarousel.children.length;
  }

  queryElements(): void {
    this.menuCarousel = document.querySelector(".menu-carousel");
    this.prevButton = document.querySelector(".previous-button");
    this.nextButton = document.querySelector(".next-button");
  }

  addEventListeners(): void {
    this.prevButton.addEventListener("click", () => {
      this.selectedIndex--;
      this.rotate();
    });

    this.nextButton.addEventListener("click", () => {
      this.selectedIndex++;
      this.rotate();
    });

    const menuOptions = this.menuCarousel.children;
    for (let i = 0; i < menuOptions.length; i++) {
      const menuOption = menuOptions[i] as HTMLDivElement;
      menuOption.addEventListener("click", () => {
        SceneManager.displayScene(menuOption.dataset["option"] as Scene);
      });
    }
  }

  rotate(): void {
    const angle = (this.selectedIndex / this.cellCount) * -360;
    this.menuCarousel.style.transform = "rotateY(" + angle + "deg)";
  }
}

new Carousel();
