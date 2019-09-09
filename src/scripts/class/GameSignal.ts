import { Signal } from "signal-ts";
import { Scene } from "../enum/Scene";

export class GameSignal {
  public static sceneDisplayed: Signal<Scene> = new Signal();
  public static audioMuteChanged: Signal<boolean> = new Signal();
  public static gamePlayCountDownStarted: Signal<number> = new Signal();
  public static gamePlayCountDownUpdated: Signal<number> = new Signal();
  public static gamePlayCountDownStopped: Signal<number> = new Signal();
  public static gamePlayCountDownTimeOver: Signal<void> = new Signal();
  public static answerSelected: Signal<string> = new Signal();
  // public static buttonPressed: Signal<void> = new Signal();
}
