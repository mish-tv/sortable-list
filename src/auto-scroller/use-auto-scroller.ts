import React from "react";

import { useInterval } from "./use-interval";
import { useAutoScrollerValue } from "./auto-scroller-value";

export const useAutoScroller = () => {
  const draggingElement = React.useRef<HTMLElement>();
  const [setInterval, clearInterval] = useInterval();
  const { addScrolledY, resetScrolledY } = useAutoScrollerValue();

  const scrollY = React.useCallback(
    (y: number) => {
      window.scrollBy(0, y);
      addScrolledY(y);
    },
    [addScrolledY],
  );
  const stopAutoScrolling = React.useCallback(() => {
    clearInterval();
    resetScrolledY();
    draggingElement.current = undefined;
  }, [clearInterval, resetScrolledY]);

  const scrollIfNeeded = React.useCallback(() => {
    const element = draggingElement.current;

    if (element == undefined) {
      stopAutoScrolling();

      return;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top < 0) {
      scrollY(-1);
    } else if (rect.bottom > window.innerHeight) {
      scrollY(1);
    } else {
      stopAutoScrolling();
    }
  }, [scrollY, stopAutoScrolling]);

  const startAutoScrollingIfNeeded = React.useCallback(
    (element: HTMLElement) => {
      if (draggingElement.current != undefined) {
        draggingElement.current = element;

        return;
      }

      const rect = element.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        draggingElement.current = element;
        setInterval(scrollIfNeeded, 5);
      }
    },
    [setInterval, scrollIfNeeded],
  );

  return [startAutoScrollingIfNeeded, stopAutoScrolling] as const;
};
