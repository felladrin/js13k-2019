import { CssSelector } from "../enum/CssSelector";
import { gameName } from "../const/gameName";

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

  public get isSoundEnabled(): boolean {
    return this.speakerElement.classList.contains("on");
  }

  toggleSound(): void {
    this.speakerElement.classList.toggle("on");
    this.speakerElement.classList.toggle("off");
  }

  public displayNotification(innerHtml: string): void {
    this.changeInnerHTML(innerHtml).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
