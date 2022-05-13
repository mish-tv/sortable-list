import React from "react";
import { RowCreator, SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string };

export const Component = (props: { initialIds: number[]; items: Record<number, Item> }) => {
  const [ids, setIds] = React.useState(props.initialIds);

  const row: RowCreator<HTMLLIElement, number> = React.useCallback(
    (id, rowAttributes, handleAttributes, options) => {
      const item = props.items[id];
      let className = "row";
      if (options.isDraggingThis) className += " draggingThis";
      if (options.isDraggingOthers) className += " draggingOthers";

      return (
        <li className={className} {...rowAttributes}>
          <button type="button" {...handleAttributes}>
            {options.index}
          </button>
          <span>{item.body}</span>
        </li>
      );
    },
    [props.items],
  );

  return (
    <ul className="list">
      <SortableList ids={ids} setIds={setIds} row={row} scrollBoundaryTop={50} scrollBoundaryBottom={100} />
    </ul>
  );
};
