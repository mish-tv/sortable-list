export type Item = { id: React.Key };

export type HandleAttributes = NonNullables<Pick<React.DOMAttributes<any>, "onMouseDown" | "onTouchStart">> &
  NonNullables<Pick<React.HTMLAttributes<any>, "style">>;
export type RowAttributes<Row> = NonNullables<Pick<React.HTMLAttributes<any>, "style">> &
  React.RefAttributes<Row> & { "sortable-list-translate-y": Nullable<number> };

export type RowCreator<Row extends HTMLElement, I extends Item> = (
  item: I,
  rowAttributes: RowAttributes<Row>,
  handleAttributes: HandleAttributes,
) => React.ReactNode;

export const getTranslateY = (dom: HTMLElement) => {
  const transformYString = dom.getAttribute("sortable-list-translate-y");

  return transformYString == undefined ? 0 : Number(transformYString);
};
