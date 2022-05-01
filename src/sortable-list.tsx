import React from "react";

import { Row } from "./row";
import { Item, RowCreator } from "./shared";

type Props<Row extends HTMLElement, I extends Item> = Readonly<{
  items: I[];
  setItems: (items: I[]) => void;
  row: RowCreator<Row, I>;
}>;

export const SortableList = <Row extends HTMLElement, I extends Item>(props: Props<Row, I>) => {
  const idToIndex = React.useMemo(
    () => props.items.reduce((previous, current, i) => ({ ...previous, [current.id]: i }), {} as Record<React.Key, number>),
    [props.items],
  );
  const offsetTopValues = React.useRef<Record<number, number>>({});
  const [currentDraggedIndexState, setCurrentDraggedIndexState] = React.useState<number>();
  const draggingItemId = React.useRef<React.Key>();

  const onStartDragging = React.useCallback((item: I) => {
    draggingItemId.current = item.id;
  }, []);

  const onDrag = React.useCallback(
    (item: I, y: number) => {
      const index = idToIndex[item.id];
      const draggedIndex = currentDraggedIndexState ?? index;
      const draggingOffset = offsetTopValues.current[index] + y;
      const upOffset = offsetTopValues.current[draggedIndex - 1];
      const downOffset = offsetTopValues.current[draggedIndex + 1];

      if (draggingOffset < upOffset) {
        setCurrentDraggedIndexState(draggedIndex - 1);
      }
      if (draggingOffset > downOffset) {
        setCurrentDraggedIndexState(draggedIndex + 1);
      }
    },
    [idToIndex, currentDraggedIndexState],
  );

  const setItems = React.useCallback(() => {
    if (draggingItemId.current == undefined || currentDraggedIndexState == undefined) return;

    const draggingItemIndex = idToIndex[draggingItemId.current];
    if (draggingItemIndex === currentDraggedIndexState) return;

    const items = [...props.items];
    const [item] = items.splice(draggingItemIndex, 1);
    items.splice(currentDraggedIndexState, 0, item);

    return items;
  }, [currentDraggedIndexState]);

  const onFinishDragging = React.useCallback(() => {
    setItems();
    draggingItemId.current = undefined;
    setCurrentDraggedIndexState(undefined);
  }, [setItems]);

  const updateOffsetTop = React.useCallback((item: I, top: number) => {
    offsetTopValues.current = { ...offsetTopValues.current, [item.id]: top };
  }, []);

  const itemIndexToTranslateY = React.useMemo<(i: number) => number>(() => {
    if (draggingItemId.current == undefined || currentDraggedIndexState == undefined) return () => 0;

    const draggingItemIndex = idToIndex[draggingItemId.current];

    if (draggingItemIndex < currentDraggedIndexState) {
      return (i) => {
        if (i < draggingItemIndex || currentDraggedIndexState < i) return 0;
        if (i === draggingItemIndex) return 0;

        return offsetTopValues.current[i - 1] - offsetTopValues.current[i];
      };
    }
    if (draggingItemIndex > currentDraggedIndexState) {
      return (i) => {
        if (i < currentDraggedIndexState || draggingItemIndex < i) return 0;
        if (i === draggingItemIndex) return 0;

        return offsetTopValues.current[i + 1] - offsetTopValues.current[i];
      };
    }

    return () => 0;
  }, [currentDraggedIndexState]);

  const rows = React.useMemo(
    () =>
      props.items.map((item, i) => (
        <Row
          key={item.id}
          item={item}
          translateY={itemIndexToTranslateY(i)}
          row={props.row}
          updateOffsetTop={updateOffsetTop}
          onStartDragging={onStartDragging}
          onDrag={onDrag}
          onFinishDragging={onFinishDragging}
        />
      )),
    [props.items, props.row, onDrag, itemIndexToTranslateY],
  );

  return <>{rows}</>;
};
