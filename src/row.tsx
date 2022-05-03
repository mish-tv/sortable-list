import React from "react";
import { DocumentEventListener } from "./document-event-listener";

import { HandleAttributes, Item, RowAttributes, RowCreator } from "./shared";
import { forwardRef } from "./utilities";

type Props<Row extends HTMLElement, I extends Item> = Readonly<{
  item: I;
  translateY: number;
  isDraggingAny: boolean;
  row: RowCreator<Row, I>;
  onStartDragging: (item: I) => void;
  onDrag: (item: I, y: number) => void;
  onFinishDragging: (item: I) => void;
}>;

export const Row = forwardRef(<Row extends HTMLElement, I extends Item>(props: Props<Row, I>, ref: React.Ref<Row>) => {
  const [mouseDownPositionYState, setMouseDownPositionYState] = React.useState<number>();
  const [translateYState, setTranslateYState] = React.useState<number>();

  const onMouseDown: HandleAttributes["onMouseDown"] = React.useCallback(
    (event) => {
      props.onStartDragging(props.item);
      setMouseDownPositionYState(event.pageY);
    },
    [props.item, props.onStartDragging],
  );

  const onMouseMove = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return (event: MouseEvent) => {
      const y = event.pageY - mouseDownPositionYState;
      props.onDrag(props.item, y);
      setTranslateYState(y);
    };
  }, [props.item, props.onDrag, mouseDownPositionYState]);

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return () => {
      props.onFinishDragging(props.item);
      setMouseDownPositionYState(undefined);
      setTranslateYState(undefined);
    };
  }, [props.item, props.onFinishDragging, mouseDownPositionYState]);

  const style: RowAttributes<Row>["style"] = React.useMemo(() => {
    if (translateYState != undefined) return { transform: `translate(0, ${translateYState}px)` };

    return {
      transform: props.translateY !== 0 ? `translate(0, ${props.translateY}px)` : undefined,
      transition: props.isDraggingAny ? "transform 0.1s" : undefined,
    };
  }, [props.translateY, props.isDraggingAny, translateYState]);

  const rowAttributes: RowAttributes<Row> = React.useMemo(() => ({ style, ref }), [style, ref]);
  const handleAttributes: HandleAttributes = React.useMemo(() => ({ onMouseDown }), [onMouseDown]);

  return (
    <>
      <DocumentEventListener onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
      {props.row(props.item, rowAttributes, handleAttributes)}
    </>
  );
});
