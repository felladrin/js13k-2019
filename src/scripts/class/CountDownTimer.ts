import { GameSignal } from "./GameSignal";

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
    GameSignal.gamePlayCountDownStarted.emit(this.count);
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
    GameSignal.gamePlayCountDownStopped.emit(this.count);
  }

  private handleTimeout(): void {
    this.count--;
    GameSignal.gamePlayCountDownUpdated.emit(this.count);

    if (this.count == 0) {
      this.stop();
      GameSignal.gamePlayCountDownTimeOver.emit();
    }
  }
}
