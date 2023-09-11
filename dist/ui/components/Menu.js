import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {UIEvents} from "../../constants/events.js";
import {openDialog} from "../../utils/ui.js";
import {useUIStore} from "../../stores/ui.js";
import {SettingsMenu} from "./menus/SettingsMenu.js";
import {useEventsListeners} from "../../utils/events.js";
export var Options;
(function(Options2) {
  Options2["POKEDEX"] = "Pokedex";
  Options2["TEAM"] = "Team";
  Options2["BAG"] = "Bag";
  Options2["YOU"] = "You";
  Options2["SETTINGS"] = "Settings";
})(Options || (Options = {}));
export var Direction;
(function(Direction2) {
  Direction2["UP"] = "up";
  Direction2["DOWN"] = "down";
})(Direction || (Direction = {}));
export const Menu = () => {
  const store = useUIStore();
  const options = Object.values(Options);
  const [hovered, setHovered] = useState(Options.POKEDEX);
  const [selected, setSelected] = useState();
  const hoverPreviousOption = () => {
    if (!selected) {
      setHovered((current) => options[options.indexOf(current) - 1] || options[options.length - 1]);
    }
  };
  const hoverNextOption = () => {
    if (!selected) {
      setHovered((current) => options[options.indexOf(current) + 1] || options[0]);
    }
  };
  const selectOption = () => {
    if (store.menu.isOpen && !selected && !store.dialog.isOpen) {
      if ([Options.POKEDEX, Options.BAG, Options.TEAM, Options.YOU].includes(hovered)) {
        openDialog("This feature is not ready yet.");
        return;
      }
      setSelected(hovered);
    }
  };
  const exit = () => {
    if (store.dialog.isOpen) {
      store.closeDialog();
    } else if (store.menu.isOpen && !selected) {
      store.toggleMenu();
    }
  };
  useEventsListeners([
    {
      name: UIEvents.UP,
      callback: hoverPreviousOption
    },
    {
      name: UIEvents.DOWN,
      callback: hoverNextOption
    },
    {
      name: UIEvents.NEXT_STEP,
      callback: selectOption
    },
    {
      name: UIEvents.EXIT,
      callback: exit
    }
  ], [
    store.closeDialog,
    store.dialog.isOpen,
    store.menu.isOpen,
    hovered,
    selected
  ]);
  useEffect(() => {
    if (store.menu.isOpen === false) {
      setHovered(Options.POKEDEX);
      setSelected(void 0);
    }
  }, [store.menu.isOpen]);
  if (selected === Options.SETTINGS) {
    return /* @__PURE__ */ React.createElement(SettingsMenu, {
      setSelectedOption: setSelected
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: "menu",
    style: {
      display: store.menu.isOpen ? "block" : "none"
    }
  }, /* @__PURE__ */ React.createElement("ul", null, options.map((option) => /* @__PURE__ */ React.createElement("li", {
    key: option,
    className: option === hovered ? "hovered" : ""
  }, option))));
};
