import { CountDownTimer } from "./CountDownTimer";
import { SceneManager } from "./SceneManager";
import { Menu } from "./Menu";
import { Header } from "./Header";
import { GameAudio } from "./GameAudio";
import { backgroundMusic } from "../const/backgroundMusic";

export class Game {
  static menu: Menu;
  static countDownTimer: CountDownTimer;
  static sceneManager: SceneManager;

  public static start(): void {
    this.countDownTimer = new CountDownTimer(10, (): void => {});
    this.sceneManager = new SceneManager();
    this.menu = new Menu();

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
      GameAudio.create(backgroundMusic, true, true);
      document.removeEventListener("mousemove", startSong);
      document.removeEventListener("touchstart", startSong);
    };

    document.addEventListener("mousemove", startSong);
    document.addEventListener("touchstart", startSong);
  }

  public static loop(): void {
    this.countDownTimer.reset();
    // fadeInSentence();
    // fadeInQuestion();
    // fadeInOptions();
    this.countDownTimer.start();
    // awaitUserResponse();
  }
}
