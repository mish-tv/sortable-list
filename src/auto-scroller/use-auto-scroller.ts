import React from "react";

import { useInterval } from "./use-interval";
import { useAutoScrollerValue } from "./auto-scroller-value";

const isTop = () => window.scrollY <= 0;
const isBottom = () => window.innerHeight + window.scrollY >= document.body.offsetHeight;

export const useAutoScroller = () => {
  const draggingElement = React.useRef<HTMLElement>();
  const [setInterval, clearInterval] = useInterval();
  const { startScrolling, updateScrolledY, resetScrolledY } = useAutoScrollerValue();

  const scrollY = React.useCallback(
    (y: number) => {
      if (y < 0 && isTop()) return;
      if (y > 0 && isBottom()) return;
      window.scrollBy(0, y);
      updateScrolledY();
    },
    [updateScrolledY],
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
      scrollY((rect.top / rect.height) * 4);
    } else if (rect.bottom > window.innerHeight) {
      scrollY(((rect.bottom - window.innerHeight) / rect.height) * 4);
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
        startScrolling();
      }
    },
    [setInterval, scrollIfNeeded, startScrolling],
  );

  return [startAutoScrollingIfNeeded, stopAutoScrolling] as const;
};
