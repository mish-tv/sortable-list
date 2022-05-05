import React from "react";
import { DocumentEventListener } from "./document-event-listener";
import { scrollDownSmallIfNeeded, useAutoScrollerValue } from "./auto-scroller";
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

const handleCommonStyle: React.HTMLAttributes<any>["style"] = { touchAction: "none" };

export const Row = forwardRef(<Row extends HTMLElement, I extends Item>(props: Props<Row, I>, ref: React.Ref<Row>) => {
  const [mouseDownPositionYState, setMouseDownPositionYState] = React.useState<number>();
  const [translateYState, setTranslateYState] = React.useState<number>();
  const { scrolledY, resetScrolledY } = useAutoScrollerValue();

  React.useEffect(() => {
    if (translateYState == undefined) return;

    props.onDrag(props.item, scrolledY + translateYState);
  }, [props.item, props.onDrag, translateYState, scrolledY]);

  const onStart = React.useCallback(
    (y: number) => {
      scrollDownSmallIfNeeded();
      props.onStartDragging(props.item);
      setMouseDownPositionYState(y);
    },
    [props.item, props.onStartDragging],
  );
  const onMouseDown = React.useCallback((e: React.MouseEvent) => onStart(e.pageY), [onStart]);
  const onTouchStart = React.useCallback((e: React.TouchEvent) => onStart(e.changedTouches[0].pageY), [onStart]);

  const onMove = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return (y: number) => {
      resetScrolledY();
      setTranslateYState(y - mouseDownPositionYState);
    };
  }, [props.item, props.onDrag, mouseDownPositionYState, resetScrolledY]);
  const onMouseMove = React.useMemo(() => (onMove == undefined ? undefined : (e: MouseEvent) => onMove(e.pageY)), [onMove]);
  const onTouchMove = React.useMemo(
    () => (onMove == undefined ? undefined : (e: TouchEvent) => onMove(e.changedTouches[0].pageY)),
    [onMove],
  );

  const onMouseUp = React.useMemo(() => {
    if (mouseDownPositionYState == undefined) return undefined;

    return () => {
      props.onFinishDragging(props.item);
      setMouseDownPositionYState(undefined);
      setTranslateYState(undefined);
    };
  }, [props.item, props.onFinishDragging, mouseDownPositionYState]);
  const onTouchEnd = React.useMemo(() => {
    if (onMouseUp == undefined) return undefined;

    return (event: TouchEvent) => {
      onMouseUp();
      event.preventDefault();
    };
  }, [onMouseUp]);

  const { style, translateY }: { style: RowAttributes<Row>["style"]; translateY: number } = React.useMemo(() => {
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

  const rowAttributes: RowAttributes<Row> = React.useMemo(
    () => ({ style, ref, "sortable-list-translate-y": translateY === 0 ? undefined : translateY }),
    [ref, style, translateY],
  );
  const handleAttributes: HandleAttributes = React.useMemo(
    () => ({ onMouseDown, onTouchStart, style: handleCommonStyle }),
    [onMouseDown, onTouchStart],
  );

  return (
    <>
      <DocumentEventListener
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onCancel={onMouseUp}
      />
      {props.row(props.item, rowAttributes, handleAttributes)}
    </>
  );
});
