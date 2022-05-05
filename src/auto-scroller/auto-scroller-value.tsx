import React from "react";
import type { Except } from "type-fest";

type Values = {
  scrolledY: number;
  startScrolling: () => void;
  updateScrolledY: () => void;
  resetScrolledY: () => void;
};

export const AutoScrollerValueContext = React.createContext({} as Values);
export const useAutoScrollerValue = () => React.useContext(AutoScrollerValueContext);

type Props = Except<React.ComponentProps<typeof AutoScrollerValueContext.Provider>, "value">;

export const AutoScrollerValueContextProvider = (props: Props) => {
  const [scrolledY, setScrolledY] = React.useState(0);
  const startScrolledY = React.useRef<number>();
  const startScrolling = React.useCallback(() => {
    startScrolledY.current = window.scrollY;
  }, []);
  const updateScrolledY = React.useCallback(() => {
    if (startScrolledY.current == undefined) return;
    setScrolledY(window.scrollY - startScrolledY.current);
  }, []);
  const resetScrolledY = React.useCallback(() => {
    setScrolledY(0);
    startScrolledY.current = window.scrollY;
  }, []);

  return (
    <AutoScrollerValueContext.Provider {...props} value={{ scrolledY, startScrolling, updateScrolledY, resetScrolledY }} />
  );
};
