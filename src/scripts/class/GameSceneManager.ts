import Tweezer from "tweezer.js";
import { TypedEvent, TypedEventDispatcher } from "typed-event-dispatcher";
import { tokens } from "typed-inject";
import { Scene } from "../enum/Scene";
import { GameHtmlElement } from "./GameHtmlElement";

export class GameSceneManager {
  public static inject = tokens("gameHtmlElement");
  public currentScene: Scene = Scene.Menu;

  public get onSceneDisplayed(): TypedEvent<Scene> {
    return this.onSceneDisplayedDispatcher.getter;
  }

  private onSceneDisplayedDispatcher = new TypedEventDispatcher<Scene>();

  constructor(private gameHtmlElement: GameHtmlElement) {
    this.displayScene(this.currentScene);
  }

  displayScene(scene: Scene): void {
    const updateOpacity = (value: number): void => {
      this.gameHtmlElement.getScene(scene).style.opacity = (value / 100).toString();
    };

    new Tweezer({
      start: 100,
      end: 0,
      duration: 500,
    })
      .on("tick", updateOpacity)
      .on("done", () => {
        for (const sceneKey of Object.keys(Scene)) {
          const sceneElement = this.gameHtmlElement.getScene(Scene[sceneKey]);
          if (scene == sceneKey) {
            sceneElement.classList.remove("inactive");
          } else {
            sceneElement.classList.add("inactive");
          }
        }

        new Tweezer({
          start: 0,
          end: 100,
          duration: 500,
        })
          .on("tick", updateOpacity)
          .on("done", () => {
            this.onSceneDisplayedDispatcher.dispatch(scene);
          })
          .begin();
      })
      .begin();
  }
}
