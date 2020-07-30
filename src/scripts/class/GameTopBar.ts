import Tweezer from "tweezer.js";
import { TypedEvent, TypedEventDispatcher } from "typed-event-dispatcher";
import { tokens } from "typed-inject";
import { gameName } from "../const/gameInfo";
import { GameCountDownTimer } from "./GameCountDownTimer";
import { GameHtmlElement } from "./GameHtmlElement";

export class GameTopBar {
  public get onAudioMuteChanged(): TypedEvent<boolean> {
    return this.onAudioMuteChangedDispatcher.getter;
  }

  public static inject = tokens("gameHtmlElement", "gameCountDownTimer");

  private onAudioMuteChangedDispatcher = new TypedEventDispatcher<boolean>();

  private readonly clockIcon: string;

  constructor(private gameHtmlElement: GameHtmlElement, private gameCountDownTimer: GameCountDownTimer) {
    this.clockIcon = this.gameHtmlElement.headerRight.innerHTML;
    this.gameHtmlElement.speaker.addEventListener("click", () => this.toggleSound());
    this.gameCountDownTimer.onGamePlayCountDownStarted.addListener((count) => this.displayCountDown(count));
    this.gameCountDownTimer.onGamePlayCountDownUpdated.addListener((count) => this.displayCountDown(count));
    this.gameCountDownTimer.onGamePlayCountDownStopped.addListener(() => this.displayClockIcon());
    this.gameCountDownTimer.onGamePlayCountDownTimeOver.addListener(() => this.displayClockIcon());
  }

  public changeInnerHTML(innerHTML: string): Promise<void> {
    return new Promise((resolve): void => {
      const updateHeaderOpacity = (value: number): void => {
        this.gameHtmlElement.headerCenter.style.opacity = (value / 100).toString();
      };

      new Tweezer({
        start: 100,
        end: 0,
        duration: 500,
      })
        .on("tick", updateHeaderOpacity)
        .on("done", () => {
          this.gameHtmlElement.headerCenter.innerHTML = innerHTML;

          new Tweezer({
            start: 0,
            end: 100,
            duration: 500,
          })
            .on("tick", updateHeaderOpacity)
            .on("done", resolve)
            .begin();
        })
        .begin();
    });
  }

  displayCountDown(count: number): void {
    this.gameHtmlElement.headerRight.innerHTML = count.toString();

    if (count > 5) return;

    const callAttention = (value: number): void => {
      this.gameHtmlElement.headerRight.style.transform = `scale(${value / 100})`;
    };

    new Tweezer({
      start: 100,
      end: 200,
      duration: 250,
    })
      .on("tick", callAttention)
      .on("done", () => {
        new Tweezer({
          start: 200,
          end: 100,
          duration: 250,
        })
          .on("tick", callAttention)
          .begin();
      })
      .begin();
  }

  displayClockIcon(): void {
    this.gameHtmlElement.headerRight.innerHTML = this.clockIcon;
  }

  public isAudioDisabled(): boolean {
    return this.gameHtmlElement.speaker.classList.contains("off");
  }

  toggleSound(): void {
    const { classList } = this.gameHtmlElement.speaker;

    classList.toggle("on");
    classList.toggle("off");

    this.onAudioMuteChangedDispatcher.dispatch(this.isAudioDisabled());
  }

  public displayNotification(innerHtml: string): void {
    this.changeInnerHTML(`<em>${innerHtml}</em>`).then(() => {
      this.changeInnerHTML(gameName).then();
    });
  }
}
