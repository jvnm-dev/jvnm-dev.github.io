import React, {useEffect, useState} from "../../web_modules/react.js";
import {isUIOpen} from "../utils/ui.js";
import {useUIStore} from "../stores/ui.js";
import {useWindowSize} from "./hooks/useWindowSize.js";
import {Dialog} from "./components/Dialog.js";
export const UI = () => {
  const [size, setSize] = useState({width: 0, height: 0});
  const windowSize = useWindowSize();
  useUIStore();
  useEffect(() => {
    const canvas = document.getElementsByTagName("canvas")?.[0];
    setSize({
      width: canvas.style?.width ?? canvas.width,
      height: canvas.style?.height ?? canvas.height
    });
  }, [windowSize]);
  return /* @__PURE__ */ React.createElement("div", {
    id: "ui",
    style: {
      display: isUIOpen() ? "block" : "none",
      width: size.width,
      height: size.height
    }
  }, /* @__PURE__ */ React.createElement(Dialog, null));
};
