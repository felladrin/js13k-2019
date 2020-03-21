import { GameSceneManager } from "./GameSceneManager";
import { Scene } from "../enum/Scene";
import { GameHtmlElement } from "./GameHtmlElement";
import { tokens } from "typed-inject";

export class GameMenu {
  public static inject = tokens("gameSceneManager", "gameHtmlElement");
  private cellCount = this.gameHtmlElement.menuCarousel.children.length;
  private selectedIndex = 0;

  constructor(private gameSceneManager: GameSceneManager, private gameHtmlElement: GameHtmlElement) {}

  initialize(): void {
    this.gameHtmlElement.previousButton.addEventListener("click", () => {
      this.selectedIndex--;
      this.rotate();
    });

    this.gameHtmlElement.nextButton.addEventListener("click", () => {
      this.selectedIndex++;
      this.rotate();
    });

    Array.from(this.gameHtmlElement.menuCarousel.children).forEach((menuOption: HTMLDivElement) => {
      menuOption.addEventListener("click", () => {
        this.gameSceneManager.displayScene(menuOption.dataset["option"] as Scene);
      });
    });
  }

  private rotate(): void {
    const angle = (this.selectedIndex / this.cellCount) * -360;
    this.gameHtmlElement.menuCarousel.style.transform = "rotateY(" + angle + "deg)";
  }
}
