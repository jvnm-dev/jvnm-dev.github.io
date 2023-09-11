import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {isUIOpen} from "../utils/ui.js";
import {useUIStore} from "../stores/ui.js";
import {useWindowSize} from "./hooks/useWindowSize.js";
import {Menu} from "./components/Menu.js";
import {Dialog} from "./components/Dialog.js";
import {Battle} from "./components/Battle.js";
export const UI = ({game}) => {
  const [size, setSize] = useState({width: 0, height: 0});
  const windowSize = useWindowSize();
  useUIStore();
  useEffect(() => {
    const canvas = document.getElementsByTagName("canvas")?.[0];
    setSize({
      width: Number(canvas.style?.width.replace("px", "")) ?? canvas.width,
      height: Number(canvas.style?.height.replace("px", "")) ?? canvas.height
    });
  }, [windowSize]);
  return /* @__PURE__ */ React.createElement("div", {
    id: "ui",
    style: {
      display: isUIOpen() ? "block" : "none",
      width: size.width,
      height: size.height
    }
  }, /* @__PURE__ */ React.createElement(Menu, null), /* @__PURE__ */ React.createElement(Dialog, null), /* @__PURE__ */ React.createElement(Battle, {
    game
  }));
};
