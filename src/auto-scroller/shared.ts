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
  "scrollHeight" in target ? target.scrollHeight : document.documentElement.scrollHeight;

export const isTop = (target: Window | HTMLElement) => getScrollY(target) <= (isOnMouseDevice() ? 0 : 1);
export const isBottom = (draggingElement: HTMLElement, target: Window | HTMLElement) => {
  const innerHeight = Math.max(getInnerHeight(target), getRelativeRect(draggingElement, target).bottom);

  return innerHeight + getScrollY(target) >= getScrollHeight(target);
};

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

export const findScrollableParent = (element: HTMLElement): Window | HTMLElement => {
  const overflowStyle = window.getComputedStyle(element).overflowY;
  if (overflowStyle === "scroll") return element;

  if (element === document.body) return window;

  return findScrollableParent(element.parentElement!);
};
