import { CssSelector } from "../enum/CssSelector";
import { gameName } from "../const/gameName";
import { GameEmitter } from "./GameEmitter";
import { GameEvent } from "../enum/GameEvent";

export class Header {
  static headerCenterElement: HTMLDivElement = document.querySelector(
    CssSelector.HeaderCenter
  );

  static headerRightElement: HTMLDivElement = document.querySelector(
    CssSelector.HeaderRight
  );

  static speakerElement: HTMLDivElement = document.querySelector(
    CssSelector.Speaker
  );

  static clockIcon = Header.headerRightElement.innerHTML;

  constructor() {
    Header.speakerElement.addEventListener("click", () => {
      Header.toggleSound();
    });

    GameEmitter.on(GameEvent.GamePlayCountDownStarted, Header.displayCountDown);
    GameEmitter.on(GameEvent.GamePlayCountDownUpdated, Header.displayCountDown);
    GameEmitter.on(GameEvent.GamePlayCountDownStopped, Header.displayClockIcon);
  }

  public changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const resolvePromise = (): void => resolve();

      const updateInnerHTML = (): void => {
        Header.headerCenterElement.innerHTML = innerHTML;
        Header.headerCenterElement.addEventListener(
          "transitionend",
          resolvePromise,
          {
            once: true
          }
        );
        Header.headerCenterElement.classList.remove("being-updated");
      };

      Header.headerCenterElement.addEventListener(
        "transitionend",
        updateInnerHTML,
        {
          once: true
        }
      );
      Header.headerCenterElement.classList.add("being-updated");
    });
  }

  static displayCountDown(count): void {
    Header.headerRightElement.innerHTML = count;
  }

  static displayClockIcon(): void {
    Header.headerRightElement.innerHTML = Header.clockIcon;
  }

  static toggleSound(): void {
    const classList = Header.speakerElement.classList;

    classList.toggle("on");
    classList.toggle("off");

    GameEmitter.emit(GameEvent.AudioMuteChanged, classList.contains("off"));
  }

  public displayNotification(innerHtml: string): void {
    this.changeInnerHTML(innerHtml).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
