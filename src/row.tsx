import React from "react";

import { DocumentEventListener } from "./document-event-listener";

import { HandleAttributes, Item, RowAttributes, RowCreator } from "./shared";

type Props<I extends Item> = Readonly<{
  item: I;
  row: RowCreator<I>;
}>;

export const Row = <I extends Item>(props: Props<I>) => {
  const [mouseDownPositionYState, setMouseDownPositionYState] = React.useState<number>();
  const [rowStyleState, setRowStyleState] = React.useState<RowAttributes["style"]>({});

  const onMouseDown: HandleAttributes["onMouseDown"] = React.useCallback((event) => {
    setMouseDownPositionYState(event.pageY);
  }, []);

  const onMouseMove = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return (event: MouseEvent) => {
      const y = event.pageY - mouseDownPositionYState;
      setRowStyleState({ transform: `translate(0, ${y}px)` });
    };
  }, [mouseDownPositionYState]);

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return () => setMouseDownPositionYState(undefined);
  }, [mouseDownPositionYState]);

  const rowAttributes: RowAttributes = React.useMemo(() => ({ style: rowStyleState }), [rowStyleState]);
  const handleAttributes: HandleAttributes = React.useMemo(() => ({ onMouseDown }), [onMouseDown]);

  return (
    <>
      <DocumentEventListener onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
      {props.row(props.item, rowAttributes, handleAttributes)}
    </>
  );
};
