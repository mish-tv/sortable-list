export const isOnMouseDevice = () => window.matchMedia("(pointer: fine)").matches;

/**
 * Implemented to work around a bug in iOS Safari that occurs only when the scroll position is at the top.
 * https://github.com/malt03/ios-safari-scroll-bug/tree/main
 */
export const scrollDownSmallIfNeeded = () => {
  if (!isOnMouseDevice() && window.scrollY === 0) window.scrollBy(0, 1);
};
