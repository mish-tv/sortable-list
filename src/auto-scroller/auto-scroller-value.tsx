import React from "react";
import type { Except } from "type-fest";

type Values = {
  scrolledY: number;
  addScrolledY: (y: number) => void;
  resetScrolledY: () => void;
};

export const AutoScrollerValueContext = React.createContext({} as Values);
export const useAutoScrollerValue = () => React.useContext(AutoScrollerValueContext);

type Props = Except<React.ComponentProps<typeof AutoScrollerValueContext.Provider>, "value">;

export const AutoScrollerValueContextProvider = (props: Props) => {
  const [scrolledY, setScrolledY] = React.useState(0);
  const addScrolledY = React.useCallback((y: number) => setScrolledY((old) => old + y), []);
  const resetScrolledY = React.useCallback(() => setScrolledY(0), []);

  return <AutoScrollerValueContext.Provider {...props} value={{ scrolledY, addScrolledY, resetScrolledY }} />;
};
