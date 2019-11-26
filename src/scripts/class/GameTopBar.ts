import { gameName } from "../const/gameName";
import { GameHtmlElement } from "./GameHtmlElement";
import Tweezer from "tweezer.js";
import { Signal } from "./Signal";
import { GameCountDownTimer } from "./GameCountDownTimer";

export class GameTopBar {
  static clockIcon = GameHtmlElement.headerRight.innerHTML;
  public static onAudioMuteChanged: Signal<boolean> = new Signal();

  public static initialize(): void {
    GameHtmlElement.speaker.addEventListener("click", () => this.toggleSound());
    GameCountDownTimer.onGamePlayCountDownStarted.add(this.displayCountDown);
    GameCountDownTimer.onGamePlayCountDownUpdated.add(this.displayCountDown);
    GameCountDownTimer.onGamePlayCountDownStopped.add(this.displayClockIcon);
    GameCountDownTimer.onGamePlayCountDownTimeOver.add(this.displayClockIcon);
  }

  public static changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const updateOpacity = (value: number): void => {
        GameHtmlElement.headerCenter.style.opacity = (value / 100).toString();
      };

      new Tweezer({
        start: 100,
        end: 0,
        duration: 500
      })
        .on("tick", updateOpacity)
        .on("done", () => {
          GameHtmlElement.headerCenter.innerHTML = innerHTML;

          new Tweezer({
            start: 0,
            end: 100,
            duration: 500
          })
            .on("tick", updateOpacity)
            .on("done", resolve)
            .begin();
        })
        .begin();
    });
  }

  static displayCountDown(count): void {
    GameHtmlElement.headerRight.innerHTML = count;

    if (count > 5) return;

    const callAttention = (value: number): void => {
      GameHtmlElement.headerRight.style.transform = `scale(${value / 100})`;
    };

    new Tweezer({
      start: 100,
      end: 200,
      duration: 250
    })
      .on("tick", callAttention)
      .on("done", () => {
        new Tweezer({
          start: 200,
          end: 100,
          duration: 250
        })
          .on("tick", callAttention)
          .begin();
      })
      .begin();
  }

  static displayClockIcon(): void {
    GameHtmlElement.headerRight.innerHTML = GameTopBar.clockIcon;
  }

  public static isAudioDisabled(): boolean {
    return GameHtmlElement.speaker.classList.contains("off");
  }

  static toggleSound(): void {
    const classList = GameHtmlElement.speaker.classList;

    classList.toggle("on");
    classList.toggle("off");

    this.onAudioMuteChanged.emit(this.isAudioDisabled());
  }

  public static displayNotification(innerHtml: string): void {
    this.changeInnerHTML(`<em>${innerHtml}</em>`).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
