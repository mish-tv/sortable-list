type Nullable<T> = T | undefined;
type NonNullables<T> = { [P in keyof T]-?: NonNullable<T[P]> };
type ExclusiveFlags<Key extends string> =
  | { [TrueK in Key]: { [K in Key]: K extends TrueK ? true : false } }[Key]
  | { [K in Key]: false };
