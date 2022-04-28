export type Item = { id: React.Key };

export type HandleAttributes = NonNullables<Pick<React.DOMAttributes<any>, "onMouseDown">>;
export type RowAttributes = NonNullables<Pick<React.HTMLAttributes<any>, "style">>;

export type RowCreator<I extends Item> = (
  item: I,
  rowAttributes: RowAttributes,
  handleAttributes: HandleAttributes,
) => React.ReactNode;

export type Vector = { x: number; y: number };
