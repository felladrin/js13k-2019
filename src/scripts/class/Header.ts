import { CssSelector } from "../enum/CssSelector";
import { gameName } from "../const/gameName";
import { GameEmitter } from "./GameEmitter";
import { GameEvent } from "../enum/GameEvent";

export class Header {
  headerTextElement: HTMLDivElement = document.querySelector(
    CssSelector.HeaderText
  );

  speakerElement: HTMLDivElement = document.querySelector(CssSelector.Speaker);

  constructor() {
    this.speakerElement.addEventListener("click", () => {
      this.toggleSound();
    });
  }

  public changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const resolvePromise = (): void => resolve();

      const updateInnerHTML = (): void => {
        this.headerTextElement.innerHTML = innerHTML;
        this.headerTextElement.addEventListener(
          "transitionend",
          resolvePromise,
          {
            once: true
          }
        );
        this.headerTextElement.classList.remove("being-updated");
      };

      this.headerTextElement.addEventListener(
        "transitionend",
        updateInnerHTML,
        {
          once: true
        }
      );
      this.headerTextElement.classList.add("being-updated");
    });
  }

  toggleSound(): void {
    const classList = this.speakerElement.classList;

    classList.toggle("on");
    classList.toggle("off");

    if (classList.contains("on")) {
      GameEmitter.emit(GameEvent.AudioEnabled);
    } else {
      GameEmitter.emit(GameEvent.AudioDisabled);
    }
  }

  public displayNotification(innerHtml: string): void {
    this.changeInnerHTML(innerHtml).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
