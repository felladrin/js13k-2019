import { GameAudio } from "../class/GameAudio";
import { GameCountDownTimer } from "../class/GameCountDownTimer";
import { GameHtmlElement } from "../class/GameHtmlElement";
import { GameListeners } from "../class/GameListeners";
import { GameMenu } from "../class/GameMenu";
import { GamePlayScene } from "../class/GamePlayScene";
import { GameSceneManager } from "../class/GameSceneManager";
import { GameStorage } from "../class/GameStorage";
import { GameStreakManager } from "../class/GameStreakManager";
import { GameTopBar } from "../class/GameTopBar";
import { rootInjector } from "typed-inject";

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
