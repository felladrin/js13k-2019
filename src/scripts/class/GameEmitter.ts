import mitt from "../../../node_modules/mitt/dist/mitt.es.js";

import { GameEvent } from "../enum/GameEvent";

export class GameEmitter {
  static emitter = mitt();

  public static on(type: GameEvent, handler: (data?) => void): void {
    this.emitter.on(type, handler);
  }

  public static off(type: GameEvent, handler: (data?) => void): void {
    this.emitter.off(type, handler);
  }

  public static emit(type: GameEvent, data?): void {
    this.emitter.emit(type, data);
  }
}
