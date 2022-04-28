import React from "react";

import { DocumentEventListener } from "./document-event-listener";

import { HandleAttributes, Item, RowAttributes, RowCreator, Vector } from "./shared";

type Props<I extends Item> = Readonly<{
  item: I;
  row: RowCreator<I>;
}>;

export const Row = <I extends Item>(props: Props<I>) => {
  const [mouseDownPositionState, setMouseDownPositionState] = React.useState<Vector>();
  const [rowStyleState, setRowStyleState] = React.useState<RowAttributes["style"]>({});

  const onMouseDown: HandleAttributes["onMouseDown"] = React.useCallback((event) => {
    setMouseDownPositionState({ x: event.pageX, y: event.pageY });
  }, []);

  const onMouseMove = React.useMemo(() => {
    if (mouseDownPositionState == undefined) return undefined;

    return (event: MouseEvent) => {
      const x = event.pageX - mouseDownPositionState.x;
      const y = event.pageY - mouseDownPositionState.y;
      setRowStyleState({ transform: `translate(${x}px, ${y}px)` });
    };
  }, [mouseDownPositionState]);

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionState == undefined) return undefined;

    return () => setMouseDownPositionState(undefined);
  }, [mouseDownPositionState]);

  const rowAttributes: RowAttributes = React.useMemo(() => ({ style: rowStyleState }), [rowStyleState]);
  const handleAttributes: HandleAttributes = React.useMemo(() => ({ onMouseDown }), [onMouseDown]);

  return (
    <>
      <DocumentEventListener onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
      {props.row(props.item, rowAttributes, handleAttributes)}
    </>
  );
};
