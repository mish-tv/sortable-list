export type HandleAttributes = NonNullables<Pick<React.DOMAttributes<any>, "onMouseDown" | "onTouchStart">> &
  NonNullables<Pick<React.HTMLAttributes<any>, "style">>;
export type RowAttributes<Row> = NonNullables<Pick<React.HTMLAttributes<any>, "style">> &
  React.RefAttributes<Row> & { "sortable-list-translate-y": Nullable<number> };

export type Options = ExclusiveFlags<"isDraggingThis" | "isDraggingOthers">;

export type RowCreator<Row extends HTMLElement, Id extends React.Key> = (
  id: Id,
  rowAttributes: RowAttributes<Row>,
  handleAttributes: HandleAttributes,
  options: Options,
) => React.ReactNode;

export const getTranslateY = (dom: HTMLElement) => {
  const transformYString = dom.getAttribute("sortable-list-translate-y");

  return transformYString == undefined ? 0 : Number(transformYString);
};
