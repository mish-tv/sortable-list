import React from "react";

import { Row } from "./row";
import { Item, RowCreator } from "./shared";

type Props<I extends Item> = Readonly<{
  items: I[];
  row: RowCreator<I>;
}>;

export const SortableList = <I extends Item>(props: Props<I>) => {
  const rows = React.useMemo(
    () => props.items.map((item) => <Row key={item.id} item={item} row={props.row} />),
    [props.items, props.row],
  );

  return <>{rows}</>;
};
