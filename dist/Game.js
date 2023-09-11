import {AUTO, Scale, Game as PhaserGame} from "../_snowpack/pkg/phaser.js";
import React from "../_snowpack/pkg/react.js";
import {createRoot} from "../_snowpack/pkg/react-dom/client.js";
import {GridEngine} from "../_snowpack/pkg/grid-engine.js";
import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import WorldScene from "./scenes/WorldScene.js";
import BattleScene from "./scenes/BattleScene.js";
import {GAME_HEIGHT, GAME_WIDTH} from "./constants/game.js";
import {UI} from "./ui/UI.js";
const gameConfig = {
  parent: "game",
  type: AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, WorldScene, BattleScene],
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
export default class Game extends PhaserGame {
  constructor(config) {
    super(config);
  }
}
export const GameComponent = () => {
  const game = new Game(gameConfig);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(UI, {
    game
  }), /* @__PURE__ */ React.createElement("div", {
    id: "game"
  }));
};
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(/* @__PURE__ */ React.createElement(GameComponent, null));
} else {
  throw new Error("Root element not found");
}
