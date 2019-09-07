import { GameEmitter } from "./GameEmitter";
import { GameEvent } from "../enum/GameEvent";

export class CountDownTimer {
  private count = 0;
  private intervalTimerId = 0;

  private static readonly ONE_SECOND = 1000;

  constructor(private initialCount: number) {
    this.reset();
  }

  public reset(): void {
    this.count = this.initialCount;
  }

  public start(): void {
    this.intervalTimerId = setInterval(() => {
      this.handleTimeout();
    }, CountDownTimer.ONE_SECOND);
    GameEmitter.emit(GameEvent.GamePlayCountDownStarted, this.count);
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
    GameEmitter.emit(GameEvent.GamePlayCountDownStopped, this.count);
  }

  private handleTimeout(): void {
    this.count--;
    GameEmitter.emit(GameEvent.GamePlayCountDownUpdated, this.count);

    if (this.count == 0) {
      this.stop();
      GameEmitter.emit(GameEvent.GamePlayCountDownTimeOver);
    }
  }
}
