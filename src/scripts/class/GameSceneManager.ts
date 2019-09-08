import { Scene } from "../enum/Scene";
import { GameSignal } from "./GameSignal";
import { GameHtmlElement } from "./GameHtmlElement";

export class GameSceneManager {
  public static currentScene: Scene = Scene.Menu;

  static initialize(): void {
    GameSceneManager.displayScene(this.currentScene);
  }

  static displayScene(scene: Scene): void {
    for (const sceneKey in Scene) {
      const sceneElement = GameHtmlElement.getScene(Scene[sceneKey]);
      if (scene == sceneKey) {
        sceneElement.classList.remove("inactive");
      } else {
        sceneElement.classList.add("inactive");
      }
    }

    GameSignal.sceneDisplayed.emit(scene);
  }
}
