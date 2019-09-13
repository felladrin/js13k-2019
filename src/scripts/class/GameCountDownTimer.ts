import { GameSignal } from "./GameSignal";

export class GameCountDownTimer {
  private static count = 0;
  private static intervalTimerId = 0;

  private static readonly ONE_SECOND = 1000;

  public static initialize(): void {
    GameSignal.answeredCorrectly.add(() => this.addBonusTime(5));
    GameSignal.answeredWrongly.add(() => this.deductTime(1));
  }

  public static addBonusTime(bonus: number): void {
    this.count += bonus;
    GameSignal.gamePlayCountDownUpdated.emit(this.count);
  }

  public static deductTime(deduction: number): void {
    this.count -= deduction;
    GameSignal.gamePlayCountDownUpdated.emit(this.count);
  }

  public static start(initialCount: number): void {
    this.count = initialCount;
    this.intervalTimerId = setInterval(() => {
      this.handleTimeout();
    }, GameCountDownTimer.ONE_SECOND);
    GameSignal.gamePlayCountDownStarted.emit(this.count);
  }

  public static stop(): void {
    clearInterval(this.intervalTimerId);
    GameSignal.gamePlayCountDownStopped.emit(this.count);
  }

  private static handleTimeout(): void {
    this.count--;
    GameSignal.gamePlayCountDownUpdated.emit(this.count);

    if (this.count <= 0) {
      this.stop();
      GameSignal.gamePlayCountDownTimeOver.emit();
    }
  }
}
