export { AutoScrollerValueContextProvider, useAutoScrollerValue } from "./auto-scroller-value";
export { useAutoScroller } from "./use-auto-scroller";

/**
 * Implemented to work around a bug in iOS Safari that occurs only when the scroll position is at the top.
 * https://github.com/malt03/ios-safari-scroll-bug/tree/main
 */
export const scrollDownSmallIfNeeded = () => {
  const isOnMouseDevice = window.matchMedia("(pointer: fine)").matches;
  if (!isOnMouseDevice && window.scrollY === 0) window.scrollBy(0, 1);
};
