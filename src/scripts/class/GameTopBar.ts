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
      new Tweezer({
        start: 100,
        end: 0,
        duration: 500
      })
        .on("tick", value => {
          GameHtmlElement.headerCenter.style.opacity = (value / 100).toString();
        })
        .on("done", () => {
          GameHtmlElement.headerCenter.innerHTML = innerHTML;

          new Tweezer({
            start: 0,
            end: 100,
            duration: 500
          })
            .on("tick", value => {
              GameHtmlElement.headerCenter.style.opacity = (
                value / 100
              ).toString();
            })
            .on("done", resolve)
            .begin();
        })
        .begin();
    });
  }

  static displayCountDown(count): void {
    GameHtmlElement.headerRight.innerHTML = count;
  }

  static displayClockIcon(): void {
    GameHtmlElement.headerRight.innerHTML = GameTopBar.clockIcon;
  }

  static toggleSound(): void {
    const classList = GameHtmlElement.speaker.classList;

    classList.toggle("on");
    classList.toggle("off");

    GameSignal.audioMuteChanged.emit(classList.contains("off"));
  }

  public static displayNotification(innerHtml: string): void {
    this.changeInnerHTML(`<em>${innerHtml}</em>`).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
