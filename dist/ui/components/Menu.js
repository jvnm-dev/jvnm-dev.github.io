import React, {useState} from "../../../web_modules/react.js";
import {UIEvents} from "../../constants/events.js";
import {useUIStore} from "../../stores/ui.js";
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
  const [selected, setSelected] = useState(Options.POKEDEX);
  const selectPreviousOption = () => {
    setSelected((current) => options[options.indexOf(current) - 1] || options[options.length - 1]);
  };
  const selectNextOption = () => {
    setSelected((current) => options[options.indexOf(current) + 1] || options[0]);
  };
  useEventsListeners([
    {
      name: UIEvents.UP,
      callback: selectPreviousOption
    },
    {
      name: UIEvents.DOWN,
      callback: selectNextOption
    }
  ]);
  return /* @__PURE__ */ React.createElement("div", {
    id: "menu",
    style: {
      display: store.menu.isOpen ? "block" : "none"
    }
  }, /* @__PURE__ */ React.createElement("ul", null, options.map((option) => /* @__PURE__ */ React.createElement("li", {
    key: option,
    className: option === selected ? "selected" : ""
  }, option))));
};
