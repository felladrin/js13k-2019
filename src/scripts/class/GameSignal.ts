import { Signal } from "./Signal";
import { Scene } from "../enum/Scene";

export class GameSignal {
  public static sceneDisplayed: Signal<Scene> = new Signal();
  public static audioMuteChanged: Signal<boolean> = new Signal();
  public static gamePlayCountDownStarted: Signal<number> = new Signal();
  public static gamePlayCountDownUpdated: Signal<number> = new Signal();
  public static gamePlayCountDownStopped: Signal<number> = new Signal();
  public static gamePlayCountDownTimeOver: Signal<void> = new Signal();
  public static buttonPressed: Signal<void> = new Signal();
  public static buttonHovered: Signal<void> = new Signal();
  public static answeredCorrectly: Signal<void> = new Signal();
  public static answeredWrongly: Signal<void> = new Signal();
}
