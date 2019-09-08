import { gameName } from "../const/gameName";
import { GameSignal } from "./GameSignal";
import { GameHtmlElement } from "./GameHtmlElement";

export class Header {
  static clockIcon = GameHtmlElement.headerRight.innerHTML;

  constructor() {
    GameHtmlElement.speaker.addEventListener("click", () => {
      Header.toggleSound();
    });

    GameSignal.gamePlayCountDownStarted.add(Header.displayCountDown);
    GameSignal.gamePlayCountDownUpdated.add(Header.displayCountDown);
    GameSignal.gamePlayCountDownStopped.add(Header.displayClockIcon);
  }

  public changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const resolvePromise = (): void => resolve();

      const updateInnerHTML = (): void => {
        GameHtmlElement.headerCenter.innerHTML = innerHTML;
        GameHtmlElement.headerCenter.addEventListener(
          "transitionend",
          resolvePromise,
          {
            once: true
          }
        );
        GameHtmlElement.headerCenter.classList.remove("being-updated");
      };

      GameHtmlElement.headerCenter.addEventListener(
        "transitionend",
        updateInnerHTML,
        {
          once: true
        }
      );
      GameHtmlElement.headerCenter.classList.add("being-updated");
    });
  }

  static displayCountDown(count): void {
    GameHtmlElement.headerRight.innerHTML = count;
  }

  static displayClockIcon(): void {
    GameHtmlElement.headerRight.innerHTML = Header.clockIcon;
  }

  static toggleSound(): void {
    const classList = GameHtmlElement.speaker.classList;

    classList.toggle("on");
    classList.toggle("off");

    GameSignal.audioMuteChanged.emit(classList.contains("off"));
  }

  public displayNotification(innerHtml: string): void {
    this.changeInnerHTML(innerHtml).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
