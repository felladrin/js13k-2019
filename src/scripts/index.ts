import "../styles/index.scss";
import { GameCountDownTimer } from "./class/GameCountDownTimer";
import { GameListeners } from "./class/GameListeners";
import { GameMenu } from "./class/GameMenu";
import { GamePlayScene } from "./class/GamePlayScene";
import { GameSceneManager } from "./class/GameSceneManager";
import { GameStreakManager } from "./class/GameStreakManager";
import { GameTopBar } from "./class/GameTopBar";
import { injector } from "./const/injector";

injector.injectClass(GameTopBar);
injector.injectClass(GameStreakManager);
injector.injectClass(GameMenu);
injector.injectClass(GameSceneManager);
injector.injectClass(GamePlayScene);
injector.injectClass(GameCountDownTimer);
injector.injectClass(GameListeners);
