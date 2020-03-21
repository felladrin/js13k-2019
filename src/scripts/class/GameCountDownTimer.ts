import { GamePlayScene } from "./GamePlayScene";
import { tokens } from "typed-inject";
import { TypedEvent, TypedEventDispatcher } from "typed-event-dispatcher/ts";

export class GameCountDownTimer {
  public get onGamePlayCountDownTimeOver(): TypedEvent {
    return this.onGamePlayCountDownTimeOverDispatcher.getter;
  }
  public get onGamePlayCountDownStopped(): TypedEvent<number> {
    return this.onGamePlayCountDownStoppedDispatcher.getter;
  }
  public get onGamePlayCountDownUpdated(): TypedEvent<number> {
    return this.onGamePlayCountDownUpdatedDispatcher.getter;
  }
  public get onGamePlayCountDownStarted(): TypedEvent<number> {
    return this.onGamePlayCountDownStartedDispatcher.getter;
  }
  public static inject = tokens("gamePlayScene");
  private onGamePlayCountDownStartedDispatcher = new TypedEventDispatcher<number>();
  private onGamePlayCountDownUpdatedDispatcher = new TypedEventDispatcher<number>();
  private onGamePlayCountDownStoppedDispatcher = new TypedEventDispatcher<number>();
  private onGamePlayCountDownTimeOverDispatcher = new TypedEventDispatcher();
  private count = 0;
  private intervalTimerId: NodeJS.Timeout = null;
  private readonly ONE_SECOND = 1000;
  private isRunning = false;

  constructor(private gamePlayScene: GamePlayScene) {}

  public initialize(): void {
    this.gamePlayScene.onAnsweredCorrectly.addListener(() => this.addBonusTime(5));
    this.gamePlayScene.onAnsweredWrongly.addListener(() => this.deductTime(1));
  }

  public addBonusTime(bonus: number): void {
    this.count += bonus;
    this.onGamePlayCountDownUpdatedDispatcher.dispatch(this.count);
  }

  public deductTime(deduction: number): void {
    this.count -= deduction;

    if (this.count > 0) {
      this.onGamePlayCountDownUpdatedDispatcher.dispatch(this.count);
    } else {
      this.stop();
      this.onGamePlayCountDownTimeOverDispatcher.dispatch();
    }
  }

  public start(initialCount: number): void {
    if (this.isRunning) return;

    this.count = initialCount;
    this.intervalTimerId = setInterval(() => {
      this.deductTime(1);
    }, this.ONE_SECOND);
    this.isRunning = true;
    this.onGamePlayCountDownStartedDispatcher.dispatch(this.count);
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
    this.isRunning = false;
    this.onGamePlayCountDownStoppedDispatcher.dispatch(this.count);
  }
}
