type Nullable<T> = T | undefined;
type NonNullables<T> = { [P in keyof T]-?: NonNullable<T[P]> };
