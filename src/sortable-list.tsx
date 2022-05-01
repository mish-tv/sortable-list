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
  const currentDraggedIndex = React.useRef<number>();

  const onDrag = React.useCallback(
    (item: I, y: number) => {
      const index = idToIndex[item.id];
      const draggedIndex = currentDraggedIndex.current ?? index;
      const draggingOffset = offsetTopValues.current[item.id] + y;
      const upOffset = offsetTopValues.current[props.items[draggedIndex - 1].id];
      const downOffset = offsetTopValues.current[props.items[draggedIndex + 1].id];

      if (draggingOffset < upOffset) {
        currentDraggedIndex.current = draggedIndex - 1;
      }
      if (draggingOffset > downOffset) {
        currentDraggedIndex.current = draggedIndex + 1;
      }

      console.info(currentDraggedIndex.current);
    },
    [idToIndex],
  );

  const updateOffsetTop = React.useCallback((item: I, top: number) => {
    offsetTopValues.current = { ...offsetTopValues.current, [item.id]: top };
  }, []);

  const rows = React.useMemo(
    () =>
      props.items.map((item) => (
        <Row key={item.id} item={item} row={props.row} updateOffsetTop={updateOffsetTop} onDrag={onDrag} />
      )),
    [props.items, props.row, onDrag],
  );

  return <>{rows}</>;
};
