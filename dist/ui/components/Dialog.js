import React, {useState, useEffect, useRef} from "../../../web_modules/react.js";
import {UIEvents} from "../../constants/events.js";
import {useUIStore} from "../../stores/ui.js";
const defaultState = {
  steps: [],
  currentStepIndex: 0
};
export const Dialog = () => {
  const store = useUIStore();
  const [state, _setState] = useState(defaultState);
  const stateRef = useRef(state);
  const setState = (data) => {
    stateRef.current = data;
    _setState(data);
  };
  const triggerNextStep = () => {
    const nextStepIndex = stateRef.current.currentStepIndex + 1;
    if (nextStepIndex <= stateRef.current.steps.length - 1) {
      setState({
        ...stateRef.current,
        currentStepIndex: nextStepIndex
      });
    } else {
      store.toggleDialog();
    }
  };
  useEffect(() => {
    window.addEventListener(UIEvents.NEXT_STEP, triggerNextStep);
    () => window.removeEventListener(UIEvents.NEXT_STEP, triggerNextStep);
  }, []);
  useEffect(() => {
    const {isOpen, content} = store.dialog;
    if (!isOpen) {
      setState(defaultState);
    }
    if (isOpen) {
      setState({
        ...state,
        steps: content.split(";")
      });
    }
  }, [store.dialog]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "dialog",
    style: {
      display: store.dialog.isOpen ? "block" : "none"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "inner"
  }, /* @__PURE__ */ React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: stateRef.current.steps[state.currentStepIndex]
    }
  }), /* @__PURE__ */ React.createElement("span", {
    className: "blink"
  }, "\u25BC")));
};
