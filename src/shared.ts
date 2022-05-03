export type Item = { id: React.Key };

export type HandleAttributes = NonNullables<Pick<React.DOMAttributes<any>, "onMouseDown">>;
export type RowAttributes<Row> = NonNullables<Pick<React.HTMLAttributes<any>, "style">> &
  React.RefAttributes<Row> & { "sortable-list-translate-y": Nullable<number> };

export type RowCreator<Row extends HTMLElement, I extends Item> = (
  item: I,
  rowAttributes: RowAttributes<Row>,
  handleAttributes: HandleAttributes,
) => React.ReactNode;
