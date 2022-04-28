import React from "react";

type Props = Readonly<{
  onMouseMove: Nullable<(event: MouseEvent) => void>;
  onMouseUp: Nullable<(event: MouseEvent) => void>;
}>;

const addEventListener = (type: "mousemove" | "mouseup", handler: Nullable<(event: MouseEvent) => void>) => {
  if (handler == undefined) return;

  document.addEventListener(type, handler);

  return () => document.removeEventListener(type, handler);
};

export const DocumentEventListener = (props: Props) => {
  React.useEffect(() => addEventListener("mousemove", props.onMouseMove), [props.onMouseMove]);
  React.useEffect(() => addEventListener("mouseup", props.onMouseUp), [props.onMouseUp]);

  return null;
};
