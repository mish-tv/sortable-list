import React from "react";
import { DocumentEventListener } from "./document-event-listener";

import { HandleAttributes, Item, RowAttributes, RowCreator } from "./shared";

type Props<Row extends HTMLElement, I extends Item> = Readonly<{
  item: I;
  row: RowCreator<Row, I>;
  onStartDragging: (item: I) => void;
  onDrag: (item: I, y: number) => void;
  onFinishDragging: (item: I) => void;
  updateOffsetTop: (item: I, top: number) => void;
}>;

export const Row = <Row extends HTMLElement, I extends Item>(props: Props<Row, I>) => {
  const [mouseDownPositionYState, setMouseDownPositionYState] = React.useState<number>();
  const [rowStyleState, setRowStyleState] = React.useState<RowAttributes<Row>["style"]>({});

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
      setRowStyleState({ transform: `translate(0, ${y}px)` });
    };
  }, [props.item, props.onDrag, mouseDownPositionYState]);

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return () => {
      props.onFinishDragging(props.item);
      setMouseDownPositionYState(undefined);
    };
  }, [props.item, props.onFinishDragging, mouseDownPositionYState]);

  const ref = React.useCallback((ref: Row) => props.updateOffsetTop(props.item, ref.offsetTop), [props.item]);

  const rowAttributes: RowAttributes<Row> = React.useMemo(() => ({ style: rowStyleState, ref }), [rowStyleState, ref]);
  const handleAttributes: HandleAttributes = React.useMemo(() => ({ onMouseDown }), [onMouseDown]);

  return (
    <>
      <DocumentEventListener onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
      {props.row(props.item, rowAttributes, handleAttributes)}
    </>
  );
};
