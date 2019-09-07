import Mitt from "mitt";

import { GameEvent } from "../enum/GameEvent";

export class GameEmitter {
  static emitter = new Mitt();

  public static on(type: GameEvent, handler: (data?) => void): void {
    this.emitter.on(type.toString(), handler);
  }

  public static off(type: GameEvent, handler: (data?) => void): void {
    this.emitter.off(type.toString(), handler);
  }

  public static emit(type: GameEvent, data?): void {
    this.emitter.emit(type.toString(), data);
  }
}
