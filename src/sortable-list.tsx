import React from "react";

import { Row } from "./row";
import { Item, RowCreator } from "./shared";

type Props<Row extends HTMLElement, I extends Item> = Readonly<{
  items: I[];
  row: RowCreator<Row, I>;
}>;

export const SortableList = <Row extends HTMLElement, I extends Item>(props: Props<Row, I>) => {
  const idToIndex = React.useMemo(
    () => props.items.reduce((previous, current, i) => ({ ...previous, [current.id]: i }), {} as Record<React.Key, number>),
    [props.items],
  );
  const offsetTopValues = React.useRef<Record<React.Key, number>>({});
  const [currentDraggedIndexState, setCurrentDraggedIndexState] = React.useState<number>();
  const draggingItemId = React.useRef<React.Key>();

  const onStartDragging = React.useCallback((item: I) => {
    draggingItemId.current = item.id;
  }, []);

  const onDrag = React.useCallback(
    (item: I, y: number) => {
      const index = idToIndex[item.id];
      const draggedIndex = currentDraggedIndexState ?? index;
      const draggingOffset = offsetTopValues.current[item.id] + y;
      const upOffset = offsetTopValues.current[props.items[draggedIndex - 1].id];
      const downOffset = offsetTopValues.current[props.items[draggedIndex + 1].id];

      if (draggingOffset < upOffset) {
        setCurrentDraggedIndexState(draggedIndex - 1);
      }
      if (draggingOffset > downOffset) {
        setCurrentDraggedIndexState(draggedIndex + 1);
      }
    },
    [idToIndex, currentDraggedIndexState],
  );

  const onFinishDragging = React.useCallback(() => {
    draggingItemId.current = undefined;
    setCurrentDraggedIndexState(undefined);
  }, []);

  const updateOffsetTop = React.useCallback((item: I, top: number) => {
    offsetTopValues.current = { ...offsetTopValues.current, [item.id]: top };
  }, []);

  const itemIndexToPresentIndex = React.useMemo<(i: number) => number>(() => {
    if (draggingItemId.current == undefined || currentDraggedIndexState == undefined) return (i) => i;

    const draggingItemIndex = idToIndex[draggingItemId.current];

    if (draggingItemIndex < currentDraggedIndexState) {
      return (i) => {
        if (i < draggingItemIndex || currentDraggedIndexState < i) return i;
        if (i === draggingItemIndex) return currentDraggedIndexState;

        return i - 1;
      };
    }
    if (draggingItemIndex > currentDraggedIndexState) {
      return (i) => {
        if (i < currentDraggedIndexState || draggingItemIndex < i) return i;
        if (i === draggingItemIndex) return currentDraggedIndexState;

        return i + 1;
      };
    }

    return (i) => i;
  }, [currentDraggedIndexState]);

  const rows = React.useMemo(
    () =>
      props.items.map((item, i) => {
        if (i !== itemIndexToPresentIndex(i)) {
          console.info(i, itemIndexToPresentIndex(i));
        }

        return (
          <Row
            key={item.id}
            item={item}
            row={props.row}
            updateOffsetTop={updateOffsetTop}
            onStartDragging={onStartDragging}
            onDrag={onDrag}
            onFinishDragging={onFinishDragging}
          />
        );
      }),
    [props.items, props.row, onDrag, itemIndexToPresentIndex],
  );

  return <>{rows}</>;
};
