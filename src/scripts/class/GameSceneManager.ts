import { Scene } from "../enum/Scene";
import { GameSignal } from "./GameSignal";
import { GameHtmlElement } from "./GameHtmlElement";
import Tweezer from "tweezer.js";

export class GameSceneManager {
  public static currentScene: Scene = Scene.Menu;

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
            GameSignal.sceneDisplayed.emit(scene);
          })
          .begin();
      })
      .begin();
  }
}
