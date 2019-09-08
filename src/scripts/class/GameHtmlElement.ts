import { Scene } from "../enum/Scene";

export class GameHtmlElement {
  public static menuCarousel: HTMLDivElement = document.querySelector(
    ".menu-carousel"
  );

  public static previousButton: HTMLDivElement = document.querySelector(
    ".previous.button"
  );

  public static nextButton: HTMLDivElement = document.querySelector(
    ".next.button"
  );

  public static headerCenter: HTMLDivElement = document.querySelector(
    ".header .center"
  );

  public static headerRight: HTMLDivElement = document.querySelector(
    ".header .right"
  );

  public static speaker: HTMLDivElement = document.querySelector(".speaker");

  public static sentenceElement: HTMLDivElement = document.querySelector(
    ".sentence"
  );
  public static questionElement: HTMLDivElement = document.querySelector(
    ".question"
  );

  public static getScene(scene: Scene): HTMLDivElement {
    return document.querySelector(`div[data-scene="${scene}"]`);
  }

  public static getAnswerButton(id: number): HTMLDivElement {
    return document.querySelector(`.answer[data-id="${id}"]`);
  }
}