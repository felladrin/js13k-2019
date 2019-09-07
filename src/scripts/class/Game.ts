import { CountDownTimer } from "./CountDownTimer";
import { SceneManager } from "./SceneManager";
import { Menu } from "./Menu";
import { Header } from "./Header";
import { GameAudio } from "./GameAudio";
import { backgroundMusic } from "../const/backgroundMusic";
import { GamePlayStateManager } from "./GamePlayStateManager";

export class Game {
  static countDownTimer = new CountDownTimer(10, (): void => {});
  static sceneManager = new SceneManager();
  static menu = new Menu();
  static header = new Header();
  static gamePlayStateManager = new GamePlayStateManager();

  public static start(): void {
    this.header.displayNotification("<em>Welcome!</em>");
    this.startBackgroundMusicOnFirstInteraction();
  }

  private static startBackgroundMusicOnFirstInteraction(): void {
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
