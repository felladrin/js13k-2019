export class CountDownTimer {
  private count = 0;
  private intervalTimerId = 0;

  private static readonly ONE_SECOND = 1000;

  constructor(private initialCount: number, private onTimeOver: () => void) {
    this.reset();
  }

  public reset(): void {
    this.count = this.initialCount;
  }

  public start(): void {
    this.intervalTimerId = setInterval(
      this.handleTimeout,
      CountDownTimer.ONE_SECOND
    );
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
  }

  private handleTimeout(): void {
    this.count--;

    if (this.count == 0) {
      this.stop();
      this.onTimeOver();
    }
  }
}
