import { Scene } from "../enum/Scene";
import { GameHtmlElement } from "./GameHtmlElement";
import Tweezer from "tweezer.js";
import { Signal } from "./Signal";

export class GameSceneManager {
  public static currentScene: Scene = Scene.Menu;
  public static onSceneDisplayed: Signal<Scene> = new Signal();

  static initialize(): void {
    GameSceneManager.displayScene(this.currentScene);
  }

  static displayScene(scene: Scene): void {
    const updateOpacity = (value: number): void => {
      GameHtmlElement.getScene(scene).style.opacity = (value / 100).toString();
    };

    new Tweezer({
      start: 100,
      end: 0,
      duration: 500
    })
      .on("tick", updateOpacity)
      .on("done", () => {
        for (const sceneKey in Scene) {
          const sceneElement = GameHtmlElement.getScene(Scene[sceneKey]);
          if (scene == sceneKey) {
            sceneElement.classList.remove("inactive");
          } else {
            sceneElement.classList.add("inactive");
          }
        }

        new Tweezer({
          start: 0,
          end: 100,
          duration: 500
        })
          .on("tick", updateOpacity)
          .on("done", () => {
            this.onSceneDisplayed.emit(scene);
          })
          .begin();
      })
      .begin();
  }
}
