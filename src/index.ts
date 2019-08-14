import "./index.scss";

import { init } from "kontra/src/core.js";
import GameLoop from "kontra/src/gameLoop.js";
import Sprite from "kontra/src/sprite.js";

init();

const sprite = Sprite({
  x: 100,
  y: 100,
  dx: 2,
  width: 20,
  height: 40,
  color: "red"
});

const loop = GameLoop({
  update() {
    sprite.update();
  },
  render() {
    sprite.render();
  }
});

loop.start();
