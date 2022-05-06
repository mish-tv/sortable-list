import React from "react";
import type { Except } from "type-fest";

import { getScrollY } from "./shared";

type Values = {
  scrolledY: number;
  startScrolling: (target: Window | HTMLElement) => void;
  updateScrolledY: (target: Window | HTMLElement) => void;
};

export const AutoScrollerValueContext = React.createContext({} as Values);
export const useAutoScrollerValue = () => React.useContext(AutoScrollerValueContext);

type Props = Except<React.ComponentProps<typeof AutoScrollerValueContext.Provider>, "value">;

export const AutoScrollerValueContextProvider = (props: Props) => {
  const [scrolledY, setScrolledY] = React.useState(0);
  const startScrolledY = React.useRef<number>();
  const lastTarget = React.useRef<Window | HTMLElement>();

  const startScrolling = React.useCallback((target: Window | HTMLElement) => {
    startScrolledY.current = getScrollY(target);
    setScrolledY(0);
    lastTarget.current = target;
  }, []);
  const updateScrolledY = React.useCallback((target: Window | HTMLElement) => {
    if (startScrolledY.current == undefined) return;
    setScrolledY(getScrollY(target) - startScrolledY.current);
    lastTarget.current = target;
  }, []);

  return <AutoScrollerValueContext.Provider {...props} value={{ scrolledY, startScrolling, updateScrolledY }} />;
};
