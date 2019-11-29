import { Signal } from "./Signal";
import { GamePlayScene } from "./GamePlayScene";

export class GameCountDownTimer {
  public static onGamePlayCountDownStarted: Signal<number> = new Signal();
  public static onGamePlayCountDownUpdated: Signal<number> = new Signal();
  public static onGamePlayCountDownStopped: Signal<number> = new Signal();
  public static onGamePlayCountDownTimeOver: Signal<void> = new Signal();

  private static count = 0;
  private static intervalTimerId = 0;
  private static readonly ONE_SECOND = 1000;

  public static initialize(): void {
    GamePlayScene.onAnsweredCorrectly.add(() => this.addBonusTime(5));
    GamePlayScene.onAnsweredWrongly.add(() => this.deductTime(1));
  }

  public static addBonusTime(bonus: number): void {
    this.count += bonus;
    this.onGamePlayCountDownUpdated.emit(this.count);
  }

  public static deductTime(deduction: number): void {
    this.count -= deduction;

    if (this.count > 0) {
      this.onGamePlayCountDownUpdated.emit(this.count);
    } else {
      this.stop();
      this.onGamePlayCountDownTimeOver.emit();
    }
  }

  public static start(initialCount: number): void {
    this.count = initialCount;
    this.intervalTimerId = setInterval(() => {
      this.deductTime(1);
    }, GameCountDownTimer.ONE_SECOND);
    this.onGamePlayCountDownStarted.emit(this.count);
  }

  public static stop(): void {
    clearInterval(this.intervalTimerId);
    this.onGamePlayCountDownStopped.emit(this.count);
  }
}
