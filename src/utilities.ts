import React from "react";

export const forwardRef: <T, P = Record<string, never>>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null = React.forwardRef;
