import React, {useState, useEffect} from "../../../../_snowpack/pkg/react.js";
import capitalize from "../../../../_snowpack/pkg/lodash/capitalize.js";
import {useEventsListeners} from "../../../utils/events.js";
import {UIEvents} from "../../../constants/events.js";
import {useUIStore} from "../../../stores/ui.js";
import {useUserDataStore} from "../../../stores/userData.js";
import {handleDialogObject} from "../../../utils/object.js";
export var Options;
(function(Options2) {
  Options2["GENERAL"] = "general";
})(Options || (Options = {}));
export var HoveringRegionDirection;
(function(HoveringRegionDirection2) {
  HoveringRegionDirection2["LEFT"] = "left";
  HoveringRegionDirection2["RIGHT"] = "right";
})(HoveringRegionDirection || (HoveringRegionDirection = {}));
export var GeneralOptions;
(function(GeneralOptions2) {
  GeneralOptions2["ENABLE_AUDIO"] = "enableAudio";
  GeneralOptions2["SKIP_INTRO_SCREEN"] = "skipIntroScreen";
})(GeneralOptions || (GeneralOptions = {}));
export const SettingsMenu = ({setSelectedOption}) => {
  const UIStore = useUIStore();
  const userDataStore = useUserDataStore();
  const [hovered, setHovered] = useState(Options.GENERAL);
  const [hoveringRegion, setHoveringRegion] = useState({
    direction: HoveringRegionDirection.LEFT
  });
  const hoverPreviousOption = () => {
    let options;
    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      options = Object.values(Options);
    }
    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      options = Object.values(GeneralOptions);
    }
    setHovered((current) => options[options.indexOf(current) - 1] || options[options.length - 1]);
  };
  const hoverNextOption = () => {
    let options;
    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      options = Object.values(Options);
    }
    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      if (hoveringRegion.leftOption === Options.GENERAL) {
        options = Object.values(GeneralOptions);
      }
    }
    setHovered((current) => options[options.indexOf(current) + 1] || options[0]);
  };
  const exit = () => {
    setSelectedOption(void 0);
    handleDialogObject({
      properties: [
        {
          name: "content",
          value: "You must reload the page for you changes to be taken in account!"
        }
      ]
    });
  };
  const processHoveredOption = () => {
    if (hovered === GeneralOptions.ENABLE_AUDIO) {
      userDataStore.update({
        ...userDataStore,
        settings: {
          ...userDataStore.settings,
          general: {
            ...userDataStore.settings.general,
            enableSound: !userDataStore.settings.general.enableSound
          }
        }
      });
    }
    if (hovered === GeneralOptions.SKIP_INTRO_SCREEN) {
      userDataStore.update({
        ...userDataStore,
        settings: {
          ...userDataStore.settings,
          general: {
            ...userDataStore.settings.general,
            skipIntroScreen: !userDataStore.settings.general.skipIntroScreen
          }
        }
      });
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
      callback: processHoveredOption
    },
    {
      name: UIEvents.LEFT,
      callback: () => setHoveringRegion({
        direction: HoveringRegionDirection.LEFT
      })
    },
    {
      name: UIEvents.RIGHT,
      callback: () => hoveringRegion.direction !== HoveringRegionDirection.RIGHT && setHoveringRegion({
        direction: HoveringRegionDirection.RIGHT,
        leftOption: hovered
      })
    },
    {
      name: UIEvents.EXIT,
      callback: exit
    }
  ], [UIStore.menu.isOpen, hovered, hoveringRegion, userDataStore.settings]);
  useEffect(() => {
    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      setHovered(Options.GENERAL);
    }
    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      if (hoveringRegion.leftOption === Options.GENERAL) {
        setHovered(GeneralOptions.ENABLE_AUDIO);
      }
    }
  }, [hoveringRegion]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "menu full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "submenu"
  }, /* @__PURE__ */ React.createElement("ul", null, Object.values(Options).map((option) => /* @__PURE__ */ React.createElement("li", {
    key: option,
    className: option === hovered ? "hovered" : ""
  }, capitalize(option))))), /* @__PURE__ */ React.createElement("div", {
    className: "content"
  }, (hovered === Options.GENERAL || hoveringRegion.leftOption === Options.GENERAL) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: GeneralOptions.ENABLE_AUDIO === hovered ? "hovered" : ""
  }, /* @__PURE__ */ React.createElement("label", null, "Enable sounds"), /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    checked: userDataStore.settings.general.enableSound,
    onChange: () => null
  })), /* @__PURE__ */ React.createElement("div", {
    className: GeneralOptions.SKIP_INTRO_SCREEN === hovered ? "hovered" : ""
  }, /* @__PURE__ */ React.createElement("label", null, "Skip intro screen"), /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    checked: userDataStore.settings.general.skipIntroScreen,
    onChange: () => null
  })))));
};
