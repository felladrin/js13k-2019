import { gameName } from "../const/gameName";
import { GameSignal } from "./GameSignal";
import { GameHtmlElement } from "./GameHtmlElement";
import Tweezer from "tweezer.js";

export class GameTopBar {
  static clockIcon = GameHtmlElement.headerRight.innerHTML;

  public static initialize(): void {
    GameHtmlElement.speaker.addEventListener("click", () => this.toggleSound());

    GameSignal.gamePlayCountDownStarted.add(this.displayCountDown);
    GameSignal.gamePlayCountDownUpdated.add(this.displayCountDown);
    GameSignal.gamePlayCountDownStopped.add(this.displayClockIcon);
    GameSignal.gamePlayCountDownTimeOver.add(this.displayClockIcon);
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

    GameSignal.audioMuteChanged.emit(this.isAudioDisabled());
  }

  public static displayNotification(innerHtml: string): void {
    this.changeInnerHTML(`<em>${innerHtml}</em>`).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
