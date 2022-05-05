import React from "react";

type Props = Readonly<{
  onMouseMove: Nullable<(event: MouseEvent) => void>;
  onMouseUp: Nullable<(event: MouseEvent) => void>;
  onTouchMove: Nullable<(event: TouchEvent) => void>;
  onTouchEnd: Nullable<(event: TouchEvent) => void>;
}>;

const addEventListener = <K extends "mousemove" | "mouseup" | "touchmove" | "touchend">(
  type: K,
  handler: Nullable<(event: DocumentEventMap[K]) => void>,
) => {
  if (handler == undefined) return;

  document.addEventListener(type, handler);

  return () => document.removeEventListener(type, handler);
};

export const DocumentEventListener = (props: Props) => {
  React.useEffect(() => addEventListener("mousemove", props.onMouseMove), [props.onMouseMove]);
  React.useEffect(() => addEventListener("mouseup", props.onMouseUp), [props.onMouseUp]);
  React.useEffect(() => addEventListener("touchmove", props.onTouchMove), [props.onTouchMove]);
  React.useEffect(() => addEventListener("touchend", props.onTouchEnd), [props.onTouchEnd]);

  return null;
};
