import React from "react";

type Item = { id: React.Key };

type Props<I extends Item> = Readonly<{
  items: I[];
  cell: (item: I) => React.ReactNode;
}>;

export const SortableList = <I extends Item>(props: Props<I>) => {
  const cells = React.useMemo(
    () => props.items.map((item) => <React.Fragment key={item.id}>{props.cell(item)}</React.Fragment>),
    [props.items, props.cell],
  );

  return <>{cells}</>;
};
