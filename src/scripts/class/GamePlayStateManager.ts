import { GamePlayState } from "../enum/GamePlayState";

export class GamePlayStateManager {
  public currentState: GamePlayState = GamePlayState.PresentingPhaseInfo;
}
