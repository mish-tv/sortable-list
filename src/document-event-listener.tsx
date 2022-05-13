import React from "react";

import { Nullable } from "./shared";

type Props = Readonly<{
  onMouseMove: Nullable<(event: MouseEvent) => void>;
  onMouseUp: Nullable<(event: MouseEvent) => void>;
  onTouchMove: Nullable<(event: TouchEvent) => void>;
  onTouchEnd: Nullable<(event: TouchEvent) => void>;
  onCancel: Nullable<() => void>;
}>;

const addEventListener = <K extends "mousemove" | "mouseup" | "touchmove" | "touchend" | "touchcancel" | "keydown">(
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
  React.useEffect(() => addEventListener("touchcancel", props.onCancel), [props.onCancel]);

  const onKeydown = React.useMemo(() => {
    const onCancel = props.onCancel;
    if (onCancel == undefined) return undefined;

    return (event: KeyboardEvent) => {
      if (event.code !== "Escape") return;
      onCancel();
    };
  }, [props.onCancel]);
  React.useEffect(() => addEventListener("keydown", onKeydown), [onKeydown]);

  return null;
};
