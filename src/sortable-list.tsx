import React from "react";

import { AutoScrollerValueContextProvider, useAutoScroller } from "./auto-scroller";
import { Row } from "./row";
import { getTranslateY, RowCreator } from "./shared";

type Props<Row extends HTMLElement, Id extends React.Key> = Readonly<{
  /** An array of resource ids. */
  ids: Id[];
  /**
   * A function that is called when the reordering is finalized (the moment the user removes their finger from the mouse).
   * When this function is called, the state should be updated to render the SortableList.
   */
  setIds: (ids: Id[]) => void;
  /** Function to create a row. */
  row: RowCreator<Row, Id>;
  /**
   * Boundary value for auto scrolling. Distance from the top of the screen.
   * @default 0
   */
  scrollBoundaryTop?: number;
  /**
   * Boundary value for auto scrolling. Distance from the bottom of the screen.
   * @default 0
   */
  scrollBoundaryBottom?: number;
}>;

// getBoundingClientRect cannot be used because it correctly reflects the position even during CSS transitions.
const getDOMPosition = (dom: Nullable<HTMLElement> | null) => {
  if (dom == undefined) return undefined;

  const top = dom.offsetTop + getTranslateY(dom);
  const bottom = top + dom.clientHeight;

  return { top, bottom };
};

const InnerSortableList = <Row extends HTMLElement, Id extends React.Key>(props: Props<Row, Id>) => {
  const [startAutoScrollingIfNeeded, stopAutoScrolling] = useAutoScroller({
    scrollBoundaryTop: props.scrollBoundaryTop ?? 0,
    scrollBoundaryBottom: props.scrollBoundaryBottom ?? 0,
  });

  const [currentDraggedIndexState, setCurrentDraggedIndexState] = React.useState<number>();
  const [draggingItemIdState, setDraggingItemId] = React.useState<React.Key>();
  const rowRefs = React.useRef<React.RefObject<Row>[]>([]);
  const upDiffRef = React.useRef<number>();
  const downDiffRef = React.useRef<number>();

  const idToIndex = React.useMemo(
    () => props.ids.reduce((previous, current, i) => ({ ...previous, [current]: i }), {} as Record<React.Key, number>),
    [props.ids],
  );

  const setIds = React.useCallback(() => {
    if (draggingItemIdState == undefined || currentDraggedIndexState == undefined) return;

    const draggingItemIndex = idToIndex[draggingItemIdState];
    if (draggingItemIndex === currentDraggedIndexState) return;

    const ids = [...props.ids];
    const [id] = ids.splice(draggingItemIndex, 1);
    ids.splice(currentDraggedIndexState, 0, id);

    props.setIds(ids);
  }, [props.setIds, currentDraggedIndexState, draggingItemIdState]);

  const onStartDragging = React.useCallback(
    (id: React.Key) => {
      setDraggingItemId(id);

      const index = idToIndex[id];
      const draggingRect = rowRefs.current[index].current?.getBoundingClientRect();
      if (draggingRect == undefined) return;

      const upRect = rowRefs.current[index - 1]?.current?.getBoundingClientRect();
      const downRect = rowRefs.current[index + 1]?.current?.getBoundingClientRect();
      if (upRect != undefined) upDiffRef.current = draggingRect.bottom - upRect.bottom;
      if (downRect != undefined) downDiffRef.current = draggingRect.top - downRect.top;
    },
    [idToIndex],
  );

  const onDrag = React.useCallback(
    (id: React.Key) => {
      if (draggingItemIdState == undefined) return;

      const index = idToIndex[id];

      const draggingDOMPosition = getDOMPosition(rowRefs.current[index].current);
      if (draggingDOMPosition == undefined) return;
      startAutoScrollingIfNeeded(rowRefs.current[index].current!);

      const [upIndex, downIndex] = (() => {
        if (currentDraggedIndexState == undefined) return [index - 1, index + 1];
        if (currentDraggedIndexState < index) return [currentDraggedIndexState - 1, currentDraggedIndexState];
        if (currentDraggedIndexState > index) return [currentDraggedIndexState, currentDraggedIndexState + 1];

        return [index - 1, index + 1];
      })();

      const upDOMPosition = getDOMPosition(rowRefs.current[upIndex]?.current);
      const downDOMPosition = getDOMPosition(rowRefs.current[downIndex]?.current);

      if (upDOMPosition != undefined && draggingDOMPosition.top <= upDOMPosition.top) {
        setCurrentDraggedIndexState((currentDraggedIndexState ?? index) - 1);
      }
      if (downDOMPosition != undefined && draggingDOMPosition.bottom >= downDOMPosition.bottom) {
        setCurrentDraggedIndexState((currentDraggedIndexState ?? index) + 1);
      }
    },
    [startAutoScrollingIfNeeded, idToIndex, currentDraggedIndexState, draggingItemIdState],
  );

  const onFinishDragging = React.useCallback(() => {
    setDraggingItemId(undefined);
    setIds();
    setCurrentDraggedIndexState(undefined);
    stopAutoScrolling();
  }, [stopAutoScrolling, setIds]);

  const itemIndexToTranslateY = React.useMemo<(i: number) => number>(() => {
    if (draggingItemIdState == undefined || currentDraggedIndexState == undefined) return () => 0;

    const draggingItemIndex = idToIndex[draggingItemIdState];

    if (draggingItemIndex < currentDraggedIndexState) {
      return (i) => {
        if (i < draggingItemIndex || currentDraggedIndexState < i) return 0;
        if (i === draggingItemIndex) return 0;

        return downDiffRef.current ?? 0;
      };
    }
    if (draggingItemIndex > currentDraggedIndexState) {
      return (i) => {
        if (i < currentDraggedIndexState || draggingItemIndex < i) return 0;
        if (i === draggingItemIndex) return 0;

        return upDiffRef.current ?? 0;
      };
    }

    return () => 0;
  }, [currentDraggedIndexState, draggingItemIdState]);

  const rows = React.useMemo(
    () =>
      props.ids.map((id, i) => {
        const ref = React.createRef<Row>();
        rowRefs.current[i] = ref;

        return (
          <Row
            key={id}
            rowRef={ref}
            id={id}
            translateY={itemIndexToTranslateY(i)}
            isDraggingAny={draggingItemIdState != undefined}
            row={props.row}
            onStartDragging={onStartDragging}
            onDrag={onDrag}
            onFinishDragging={onFinishDragging}
          />
        );
      }),
    [props.ids, props.row, draggingItemIdState, onDrag, itemIndexToTranslateY],
  );

  return <>{rows}</>;
};

export const SortableList = <Row extends HTMLElement, Id extends React.Key>(props: Props<Row, Id>) => (
  <AutoScrollerValueContextProvider>
    <InnerSortableList {...props} />
  </AutoScrollerValueContextProvider>
);
