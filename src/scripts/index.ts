import "../styles/index.scss";
import { injector } from "./const/injector";
import { GameTopBar } from "./class/GameTopBar";
import { GameStreakManager } from "./class/GameStreakManager";
import { GameMenu } from "./class/GameMenu";
import { GameSceneManager } from "./class/GameSceneManager";
import { GamePlayScene } from "./class/GamePlayScene";
import { GameCountDownTimer } from "./class/GameCountDownTimer";
import { GameListeners } from "./class/GameListeners";

injector.injectClass(GameTopBar);
injector.injectClass(GameStreakManager);
injector.injectClass(GameMenu);
injector.injectClass(GameSceneManager);
injector.injectClass(GamePlayScene);
injector.injectClass(GameCountDownTimer);
injector.injectClass(GameListeners);
