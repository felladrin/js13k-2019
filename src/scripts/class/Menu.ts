import { CssSelector } from "../enum/CssSelector";
import { SceneManager } from "./SceneManager";
import { Scene } from "../enum/Scene";

export class Menu {
  menuCarousel: HTMLDivElement;
  prevButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  cellCount: number;
  selectedIndex = 0;

  constructor() {
    this.queryElements();
    this.addEventListeners();
    this.cellCount = this.menuCarousel.children.length;
  }

  queryElements(): void {
    this.menuCarousel = document.querySelector(CssSelector.MenuCarousel);
    this.prevButton = document.querySelector(CssSelector.PreviousButton);
    this.nextButton = document.querySelector(CssSelector.NextButton);
  }

  addEventListeners(): void {
    this.prevButton.addEventListener("click", () => {
      this.selectedIndex--;
      this.rotate();
    });

    this.nextButton.addEventListener("click", () => {
      this.selectedIndex++;
      this.rotate();
    });

    const menuOptions = this.menuCarousel.children;
    for (let i = 0; i < menuOptions.length; i++) {
      const menuOption = menuOptions[i] as HTMLDivElement;
      menuOption.addEventListener("click", () => {
        SceneManager.displayScene(menuOption.dataset["option"] as Scene);
      });
    }
  }

  rotate(): void {
    const angle = (this.selectedIndex / this.cellCount) * -360;
    this.menuCarousel.style.transform = "rotateY(" + angle + "deg)";
  }
}
