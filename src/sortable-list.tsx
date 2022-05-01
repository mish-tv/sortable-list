import React from "react";

import { Row } from "./row";
import { Item, RowCreator } from "./shared";

type Props<Row extends HTMLElement, I extends Item> = Readonly<{
  items: I[];
  row: RowCreator<Row, I>;
}>;

export const SortableList = <Row extends HTMLElement, I extends Item>(props: Props<Row, I>) => {
  const onDrag = React.useCallback((item: I, y: number) => {
    console.info(item.id, y);
  }, []);

  const updateOffsetTop = React.useCallback((item: I, top: number) => console.info(item.id, top), []);
  // refs.current = props.items.map(() => React.createRef());

  const rows = React.useMemo(
    () =>
      props.items.map((item) => (
        <Row key={item.id} item={item} row={props.row} updateOffsetTop={updateOffsetTop} onDrag={onDrag} />
      )),
    [props.items, props.row, onDrag],
  );

  return <>{rows}</>;
};
