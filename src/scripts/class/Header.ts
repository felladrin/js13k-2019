import { CssSelector } from "../enum/CssSelector";

export class Header {
  static headerTextElement: HTMLDivElement = document.querySelector(
    CssSelector.HeaderText
  );

  static speakerElement: HTMLDivElement = document.querySelector(
    CssSelector.Speaker
  );

  public static changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const resolvePromise = (): void => resolve();

      const updateInnerHTML = (): void => {
        Header.headerTextElement.innerHTML = innerHTML;
        Header.headerTextElement.addEventListener(
          "transitionend",
          resolvePromise,
          {
            once: true
          }
        );
        Header.headerTextElement.classList.remove("being-updated");
      };

      Header.headerTextElement.addEventListener(
        "transitionend",
        updateInnerHTML,
        {
          once: true
        }
      );
      Header.headerTextElement.classList.add("being-updated");
    });
  }

  public get isSoundEnabled(): boolean {
    return Header.speakerElement.classList.contains("on");
  }

  public static toggleSound(): void {
    Header.speakerElement.classList.toggle("on");
    Header.speakerElement.classList.toggle("off");
  }
}
