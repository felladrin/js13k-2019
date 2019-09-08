import { SceneManager } from "./SceneManager";
import { Scene } from "../enum/Scene";
import { GameHtmlElement } from "./GameHtmlElement";

export class Menu {
  cellCount = GameHtmlElement.menuCarousel.children.length;
  selectedIndex = 0;

  constructor() {
    this.addEventListeners();
  }

  addEventListeners(): void {
    GameHtmlElement.previousButton.addEventListener("click", () => {
      this.selectedIndex--;
      this.rotate();
    });

    GameHtmlElement.nextButton.addEventListener("click", () => {
      this.selectedIndex++;
      this.rotate();
    });

    const menuOptions = GameHtmlElement.menuCarousel.children;
    for (let i = 0; i < menuOptions.length; i++) {
      const menuOption = menuOptions[i] as HTMLDivElement;
      menuOption.addEventListener("click", () => {
        SceneManager.displayScene(menuOption.dataset["option"] as Scene);
      });
    }
  }

  private rotate(): void {
    const angle = (this.selectedIndex / this.cellCount) * -360;
    GameHtmlElement.menuCarousel.style.transform = "rotateY(" + angle + "deg)";
  }
}
