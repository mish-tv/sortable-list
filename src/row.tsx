import React from "react";
import { DocumentEventListener } from "./document-event-listener";
import { findScrollableParent, scrollDownSmallIfNeeded, useAutoScrollerValue } from "./auto-scroller";
import { HandleAttributes, Options, RowAttributes, RowCreator } from "./shared";

type Props<Row extends HTMLElement, Id extends React.Key> = Readonly<{
  id: Id;
  index: number;
  translateY: number;
  isDraggingAny: boolean;
  rowRef: React.RefObject<Row>;
  row: RowCreator<Row, Id>;
  onStartDragging: (id: Id) => void;
  onDrag: (id: Id, y: number) => void;
  onFinishDragging: (id: Id) => void;
}>;

const handleCommonStyle: React.HTMLAttributes<any>["style"] = { touchAction: "none" };

export const Row = <Row extends HTMLElement, Id extends React.Key>(props: Props<Row, Id>) => {
  const [mouseDownPositionYState, setMouseDownPositionYState] = React.useState<number>();
  const [translateYState, setTranslateYState] = React.useState<number>();
  const { scrolledY, startScrolling } = useAutoScrollerValue();

  React.useEffect(() => {
    if (translateYState == undefined) return;

    props.onDrag(props.id, scrolledY + translateYState);
  }, [props.id, props.onDrag, translateYState, scrolledY]);

  const onStart = React.useCallback(
    (y: number) => {
      scrollDownSmallIfNeeded();
      props.onStartDragging(props.id);
      setMouseDownPositionYState(y);
      if (props.rowRef.current != undefined) startScrolling(findScrollableParent(props.rowRef.current));
    },
    [props.id, props.rowRef, props.onStartDragging, startScrolling],
  );
  const onMouseDown = React.useCallback((e: React.MouseEvent) => onStart(e.clientY), [onStart]);
  const onTouchStart = React.useCallback((e: React.TouchEvent) => onStart(e.changedTouches[0].clientY), [onStart]);

  const onMove = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return (y: number) => {
      setTranslateYState(y - mouseDownPositionYState);
    };
  }, [props.id, props.onDrag, mouseDownPositionYState]);
  const onMouseMove = React.useMemo(
    () => (onMove == undefined ? undefined : (e: MouseEvent) => onMove(e.clientY)),

    [onMove],
  );
  const onTouchMove = React.useMemo(
    () => (onMove == undefined ? undefined : (e: TouchEvent) => onMove(e.changedTouches[0].clientY)),
    [onMove],
  );

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return () => {
      props.onFinishDragging(props.id);
      setMouseDownPositionYState(undefined);
      setTranslateYState(undefined);
    };
  }, [props.id, props.onFinishDragging, mouseDownPositionYState]);
  const onTouchEnd = React.useMemo(() => {
    if (onMouseUp == undefined) return undefined;

    return (event: TouchEvent) => {
      onMouseUp();
      event.preventDefault();
    };
  }, [onMouseUp]);

  const { style, translateY }: { style: RowAttributes["style"]; translateY: number } = React.useMemo(() => {
    if (translateYState != undefined) {
      const translateY = scrolledY + translateYState;

      return { style: { transform: `translateY(${translateY}px)` }, translateY };
    }

    return {
      style: {
        transform: props.translateY !== 0 ? `translateY(${props.translateY}px)` : undefined,
        transition: props.isDraggingAny ? "transform 0.1s" : undefined,
      },
      translateY: props.translateY,
    };
  }, [props.translateY, props.isDraggingAny, translateYState, scrolledY]);

  const rowAttributes: RowAttributes = React.useMemo(
    () => ({ style, "sortable-list-translate-y": translateY === 0 ? undefined : translateY }),
    [style, translateY],
  );
  const handleAttributes: HandleAttributes = React.useMemo(
    () => ({ onMouseDown, onTouchStart, style: handleCommonStyle }),
    [onMouseDown, onTouchStart],
  );
  const options: Options = React.useMemo(() => {
    const isDraggingThis = mouseDownPositionYState != undefined;
    if (isDraggingThis) return { index: props.index, isDraggingThis, isDraggingOthers: false };

    return { index: props.index, isDraggingThis, isDraggingOthers: props.isDraggingAny };
  }, [props.index, props.isDraggingAny, mouseDownPositionYState]);

  return (
    <>
      <DocumentEventListener
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onCancel={onMouseUp}
      />
      {props.row({ id: props.id, rowAttributes, rowRef: props.rowRef, handleAttributes, options })}
    </>
  );
};
