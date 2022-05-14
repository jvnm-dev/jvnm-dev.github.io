import {useEffect} from "../../web_modules/react.js";
export const useEventsListeners = (listeners, deps) => {
  useEffect(() => {
    listeners.forEach(({name, callback}) => window.addEventListener(name, callback));
    return () => {
      listeners.forEach(({name, callback}) => window.removeEventListener(name, callback));
    };
  }, deps);
};
