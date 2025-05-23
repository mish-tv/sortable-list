import React from "react";

import { useInterval } from "./use-interval";
import { useAutoScrollerValue } from "./auto-scroller-value";
import { findScrollableParent, getInnerHeight, getRelativeRect, isBottom, isOnMouseDevice, isTop } from "./shared";

type Options = Readonly<{
  scrollBoundaryTop: number;
  scrollBoundaryBottom: number;
}>;

export const useAutoScroller = (options: Options) => {
  const dragging = React.useRef<{ element: HTMLElement; scrollable: HTMLElement | Window }>(undefined);
  const [setInterval, clearInterval] = useInterval();
  const { updateScrolledY } = useAutoScrollerValue();

  const scrollY = React.useCallback(
    (y: number) => {
      const current = dragging.current;
      if (current == undefined) return;

      if (y < 0 && isTop(current.scrollable)) {
        if (!isOnMouseDevice()) current.scrollable.scrollTo({ top: 1 });

        return;
      }
      if (y > 0 && isBottom(current.element, current.scrollable)) return;

      current.scrollable.scrollBy({ top: y, behavior: "instant" as any });
      updateScrolledY(current.scrollable);
    },
    [updateScrolledY],
  );
  const stopAutoScrolling = React.useCallback(() => {
    clearInterval();
    dragging.current = undefined;
  }, [clearInterval]);

  const scrollIfNeeded = React.useCallback(() => {
    const current = dragging.current;

    if (current == undefined) {
      stopAutoScrolling();

      return;
    }

    const rect = getRelativeRect(current.element, current.scrollable);

    if (rect.top < options.scrollBoundaryTop) {
      scrollY(((rect.top - options.scrollBoundaryTop) / rect.height) * 4);
    } else if (rect.bottom > getInnerHeight(current.scrollable) - options.scrollBoundaryBottom) {
      scrollY(((rect.bottom - getInnerHeight(current.scrollable) + options.scrollBoundaryBottom) / rect.height) * 4);
    } else {
      stopAutoScrolling();
    }
  }, [options.scrollBoundaryTop, options.scrollBoundaryBottom, scrollY, stopAutoScrolling]);

  const startAutoScrollingIfNeeded = React.useCallback(
    (element: HTMLElement) => {
      const scrollable = findScrollableParent(element);

      if (dragging.current != undefined) {
        dragging.current = { element, scrollable };

        return;
      }

      const rect = getRelativeRect(element, scrollable);
      if (rect.top < options.scrollBoundaryTop || rect.bottom > getInnerHeight(scrollable) - options.scrollBoundaryBottom) {
        dragging.current = { element, scrollable };
        setInterval(scrollIfNeeded, 5);
      }
    },
    [options.scrollBoundaryTop, options.scrollBoundaryBottom, setInterval, scrollIfNeeded],
  );

  return [startAutoScrollingIfNeeded, stopAutoScrolling] as const;
};
