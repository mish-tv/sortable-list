import React from "react";

import { useInterval } from "./use-interval";
import { useAutoScrollerValue } from "./auto-scroller-value";
import { isOnMouseDevice } from "./shared";

const isTop = () => window.scrollY <= 0;
const isBottom = () => window.innerHeight + window.scrollY >= document.body.offsetHeight;

type Options = Readonly<{
  scrollBoundaryTop: number;
  scrollBoundaryBottom: number;
}>;

export const useAutoScroller = (options: Options) => {
  const draggingElement = React.useRef<HTMLElement>();
  const [setInterval, clearInterval] = useInterval();
  const { startScrolling, updateScrolledY, resetScrolledY } = useAutoScrollerValue();

  const scrollY = React.useCallback(
    (y: number) => {
      if (y < 0 && isTop()) {
        if (!isOnMouseDevice()) window.scrollTo(window.scrollX, 1);

        return;
      }
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
    if (rect.top < options.scrollBoundaryTop) {
      scrollY(((rect.top - options.scrollBoundaryTop) / rect.height) * 4);
    } else if (rect.bottom > window.innerHeight - options.scrollBoundaryBottom) {
      scrollY(((rect.bottom - window.innerHeight + options.scrollBoundaryBottom) / rect.height) * 4);
    } else {
      stopAutoScrolling();
    }
  }, [options.scrollBoundaryTop, options.scrollBoundaryBottom, scrollY, stopAutoScrolling]);

  const startAutoScrollingIfNeeded = React.useCallback(
    (element: HTMLElement) => {
      if (draggingElement.current != undefined) {
        draggingElement.current = element;

        return;
      }

      const rect = element.getBoundingClientRect();
      if (rect.top < options.scrollBoundaryTop || rect.bottom > window.innerHeight - options.scrollBoundaryBottom) {
        draggingElement.current = element;
        setInterval(scrollIfNeeded, 5);
        startScrolling();
      }
    },
    [options.scrollBoundaryTop, options.scrollBoundaryBottom, setInterval, scrollIfNeeded, startScrolling],
  );

  return [startAutoScrollingIfNeeded, stopAutoScrolling] as const;
};
