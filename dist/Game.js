import Phaser from "../web_modules/phaser.js";
import React from "../web_modules/react.js";
import ReactDOM from "../web_modules/react-dom.js";
import {GridEngine} from "../web_modules/grid-engine.js";
import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import WorldScene from "./scenes/WorldScene.js";
import {GAME_HEIGHT, GAME_WIDTH} from "./constants/game.js";
import {UI} from "./ui/UI.js";
const gameConfig = {
  parent: "game",
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, WorldScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0},
      debug: true
    }
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine"
      }
    ]
  }
};
export default class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}
export const GameComponent = () => {
  const game = new Game(gameConfig);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(UI, null), /* @__PURE__ */ React.createElement("div", {
    id: "game"
  }));
};
ReactDOM.render(/* @__PURE__ */ React.createElement(GameComponent, null), document.getElementById("root"));
