import "../styles/index.scss";
import { GameListeners } from "./class/GameListeners";
import { GameMenu } from "./class/GameMenu";
import { injector } from "./const/injector";

injector.injectClass(GameMenu);
injector.injectClass(GameListeners);
