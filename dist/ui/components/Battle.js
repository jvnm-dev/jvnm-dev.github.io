import React from "../../../_snowpack/pkg/react.js";
import {useEventsListeners} from "../../utils/events.js";
import {Audios} from "../../constants/assets.js";
import {UIEvents} from "../../constants/events.js";
import {useUIStore} from "../../stores/ui.js";
import {getAudioConfig} from "../../utils/audio.js";
export const Battle = ({game}) => {
  const UIStore = useUIStore();
  useEventsListeners([
    {
      name: UIEvents.EXIT,
      callback: () => {
        if (UIStore.battle.isOpen) {
          game.sound.stopAll();
          game.sound.play(Audios.MUSIC, getAudioConfig());
          game.scene.stop("Battle").start("World", {
            facingDirection: void 0,
            startPosition: void 0
          });
          useUIStore.getState().toggleBattle();
        }
      }
    }
  ], [UIStore.battle.isOpen]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "battle_menu",
    style: {
      display: UIStore.battle.isOpen ? "block" : "none"
    }
  }, /* @__PURE__ */ React.createElement("h1", null, "Test"));
};
