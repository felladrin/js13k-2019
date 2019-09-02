import "./index.scss";
import { playBackgroundMusic } from "./soundbox-player";

enum CssSelector {
  Scene = 'div[data-scene="*"]',
  MenuCarousel = ".menu-carousel",
  PreviousButton = ".previous.button",
  NextButton = ".next.button",
  HeaderText = ".header .center",
  Speaker = ".speaker"
}

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
    return document.querySelector(CssSelector.Scene.replace("*", scene));
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
    this.menuCarousel = document.querySelector(CssSelector.MenuCarousel);
    this.prevButton = document.querySelector(CssSelector.PreviousButton);
    this.nextButton = document.querySelector(CssSelector.NextButton);
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

class Header {
  static headerTextElement: HTMLDivElement = document.querySelector(
    CssSelector.HeaderText
  );

  static speakerElement: HTMLDivElement = document.querySelector(
    CssSelector.Speaker
  );

  public static changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const resolvePromise = (): void => resolve();

      const updateInnerHTML = (): void => {
        Header.headerTextElement.innerHTML = innerHTML;
        Header.headerTextElement.addEventListener(
          "transitionend",
          resolvePromise,
          {
            once: true
          }
        );
        Header.headerTextElement.classList.remove("being-updated");
      };

      Header.headerTextElement.addEventListener(
        "transitionend",
        updateInnerHTML,
        {
          once: true
        }
      );
      Header.headerTextElement.classList.add("being-updated");
    });
  }

  public get isSoundEnabled() {
    return Header.speakerElement.classList.contains("on");
  }

  public static toggleSound() {
    Header.speakerElement.classList.toggle("on");
    Header.speakerElement.classList.toggle("off");
  }
}

Header.changeInnerHTML("<strong>It</strong> <em>Works</em>!").then(() => {
  Header.changeInnerHTML("Back Read").then();
});

Header.speakerElement.addEventListener("click", () => {
  Header.toggleSound();
});

document.querySelector(".header .center").addEventListener("click", () => {
  location.reload();
});

const startSong = (): void => {
  playBackgroundMusic();
  document.removeEventListener("mousemove", startSong);
  document.removeEventListener("touchstart", startSong);
};

document.addEventListener("mousemove", startSong);
document.addEventListener("touchstart", startSong);
