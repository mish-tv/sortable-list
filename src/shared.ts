export type Nullable<T> = T | undefined;
export type NonNullables<T> = { [P in keyof T]-?: NonNullable<T[P]> };
export type ExclusiveFlags<Key extends string> =
  | { [TrueK in Key]: { [K in Key]: K extends TrueK ? true : false } }[Key]
  | { [K in Key]: false };

export type HandleAttributes = NonNullables<Pick<React.DOMAttributes<any>, "onMouseDown" | "onTouchStart">> &
  NonNullables<Pick<React.HTMLAttributes<any>, "style">>;
export type RowAttributes = NonNullables<Pick<React.HTMLAttributes<any>, "style">> & {
  "sortable-list-translate-y": Nullable<number>;
};

export type Options = ExclusiveFlags<"isDraggingThis" | "isDraggingOthers"> & { index: number };

export type RowCreator<Row extends HTMLElement, Id extends Key> = (args: {
  id: Id;
  rowAttributes: RowAttributes;
  rowRef: React.Ref<Row>;
  handleAttributes: HandleAttributes;
  options: Options;
}) => React.ReactNode;

export const getTranslateY = (dom: HTMLElement) => {
  const transformYString = dom.getAttribute("sortable-list-translate-y");

  return transformYString == undefined ? 0 : Number(transformYString);
};

export type Key = number | string;
