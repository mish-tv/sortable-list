export const isOnMouseDevice = () => window.matchMedia("(pointer: fine)").matches;

/**
 * Implemented to work around a bug in iOS Safari that occurs only when the scroll position is at the top.
 * https://github.com/malt03/ios-safari-scroll-bug/tree/main
 */
export const scrollDownSmallIfNeeded = () => {
  if (!isOnMouseDevice() && window.scrollY === 0) window.scrollBy(0, 1);
};

export const getScrollX = (target: Window | HTMLElement) => ("scrollX" in target ? target.scrollX : target.scrollLeft);
export const getScrollY = (target: Window | HTMLElement) => ("scrollY" in target ? target.scrollY : target.scrollTop);
export const getInnerHeight = (target: Window | HTMLElement) =>
  "offsetHeight" in target ? target.offsetHeight : target.innerHeight;
const getScrollHeight = (target: Window | HTMLElement) =>
  "scrollHeight" in target ? target.scrollHeight : document.body.scrollHeight;

export const isTop = (target: Window | HTMLElement) => getScrollY(target) <= (isOnMouseDevice() ? 0 : 1);
export const isBottom = (target: Window | HTMLElement) =>
  getInnerHeight(target) + getScrollY(target) >= getScrollHeight(target);

type Rect = { top: number; bottom: number; height: number };
export const getRelativeRect = (target: HTMLElement, relative: Window | HTMLElement): Rect => {
  const targetRect = target.getBoundingClientRect();

  if ("getBoundingClientRect" in relative) {
    const relativeRect = relative.getBoundingClientRect();
    const top = targetRect.top - relativeRect.top;

    return { top, bottom: top + targetRect.height, height: targetRect.height };
  }

  return targetRect;
};

const scrollableStyles = new Set(["scroll", "auto"]);
export const findScrollableParent = (element: HTMLElement): Window | HTMLElement => {
  const overflowStyle = window.getComputedStyle(element).overflowY;
  if (scrollableStyles.has(overflowStyle)) return element;

  if (element === document.body) return window;

  return findScrollableParent(element.parentElement!);
};
