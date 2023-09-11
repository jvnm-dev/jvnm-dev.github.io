import {useState, useEffect} from "../../../_snowpack/pkg/react.js";
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: void 0,
    height: void 0
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};
