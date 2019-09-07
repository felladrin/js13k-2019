import { Scene } from "../enum/Scene";
import { CssSelector } from "../enum/CssSelector";
import { GameEmitter } from "./GameEmitter";
import { GameEvent } from "../enum/GameEvent";

export class SceneManager {
  public currentScene: Scene = Scene.Menu;

  constructor() {
    SceneManager.displayScene(this.currentScene);
  }

  static displayScene(scene: Scene): void {
    for (const sceneKey in Scene) {
      const sceneElement = SceneManager.getSceneElement(Scene[sceneKey]);
      if (scene == sceneKey) {
        sceneElement.classList.remove("inactive");
      } else {
        sceneElement.classList.add("inactive");
      }
    }

    GameEmitter.emit(GameEvent.SceneDisplayed, scene);
  }

  static getSceneElement(scene: string): HTMLDivElement {
    return document.querySelector(CssSelector.Scene.replace("*", scene));
  }
}
