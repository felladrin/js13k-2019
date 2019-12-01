import { Signal } from "./Signal";
import { GamePlayScene } from "./GamePlayScene";
import { tokens } from "typed-inject";

export class GameCountDownTimer {
  public static inject = tokens("gamePlayScene");
  public onGamePlayCountDownStarted: Signal<number> = new Signal();
  public onGamePlayCountDownUpdated: Signal<number> = new Signal();
  public onGamePlayCountDownStopped: Signal<number> = new Signal();
  public onGamePlayCountDownTimeOver: Signal<void> = new Signal();
  private count = 0;
  private intervalTimerId = 0;
  private readonly ONE_SECOND = 1000;
  private isRunning = false;

  constructor(private gamePlayScene: GamePlayScene) {}

  public initialize(): void {
    this.gamePlayScene.onAnsweredCorrectly.add(() => this.addBonusTime(5));
    this.gamePlayScene.onAnsweredWrongly.add(() => this.deductTime(1));
  }

  public addBonusTime(bonus: number): void {
    this.count += bonus;
    this.onGamePlayCountDownUpdated.emit(this.count);
  }

  public deductTime(deduction: number): void {
    this.count -= deduction;

    if (this.count > 0) {
      this.onGamePlayCountDownUpdated.emit(this.count);
    } else {
      this.stop();
      this.onGamePlayCountDownTimeOver.emit();
    }
  }

  public start(initialCount: number): void {
    if (this.isRunning) return;

    this.count = initialCount;
    this.intervalTimerId = setInterval(() => {
      this.deductTime(1);
    }, this.ONE_SECOND);
    this.isRunning = true;
    this.onGamePlayCountDownStarted.emit(this.count);
  }

  public stop(): void {
    clearInterval(this.intervalTimerId);
    this.isRunning = false;
    this.onGamePlayCountDownStopped.emit(this.count);
  }
}
