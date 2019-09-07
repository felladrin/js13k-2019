import { CountDownTimer } from "./CountDownTimer";
import { SceneManager } from "./SceneManager";
import { Menu } from "./Menu";
import { Header } from "./Header";
import { GameAudio } from "./GameAudio";
import { backgroundMusic } from "../const/backgroundMusic";

export class Game {
  static countDownTimer: CountDownTimer;
  static sceneManager: SceneManager;
  static menu: Menu;
  static header: Header;

  public static start(): void {
    this.initializeStaticFields();
    this.header.displayNotification("<em>Welcome!</em>");
    this.startBackgroundMusicOnFirstInteraction();
  }

  private static initializeStaticFields(): void {
    this.countDownTimer = new CountDownTimer(10, (): void => {});
    this.sceneManager = new SceneManager();
    this.menu = new Menu();
    this.header = new Header();
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
