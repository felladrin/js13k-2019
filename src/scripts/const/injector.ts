import { rootInjector } from "typed-inject";
import { GameTopBar } from "../class/GameTopBar";
import { GameStreakManager } from "../class/GameStreakManager";
import { GameMenu } from "../class/GameMenu";
import { GameSceneManager } from "../class/GameSceneManager";
import { GamePlayScene } from "../class/GamePlayScene";
import { GameCountDownTimer } from "../class/GameCountDownTimer";
import { GameListeners } from "../class/GameListeners";
import { GameStorage } from "../class/GameStorage";
import { GameHtmlElement } from "../class/GameHtmlElement";
import { GameAudio } from "../class/GameAudio";

export const injector = rootInjector
  .provideClass("gameHtmlElement", GameHtmlElement)
  .provideClass("gameStorage", GameStorage)
  .provideClass("gameStreakManager", GameStreakManager)
  .provideClass("gamePlayScene", GamePlayScene)
  .provideClass("gameCountDownTimer", GameCountDownTimer)
  .provideClass("gameTopBar", GameTopBar)
  .provideClass("gameSceneManager", GameSceneManager)
  .provideClass("gameMenu", GameMenu)
  .provideClass("gameAudio", GameAudio)
  .provideClass("gameListeners", GameListeners);
