<h1 align="center">
  @mish-tv/sortable-list
  <div align="center">
    <a href="https://www.npmjs.com/package/@mish-tv/sortable-list"><img src="https://img.shields.io/npm/v/@mish-tv/sortable-list.svg" alt="npm"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/mish-tv/sortable-list.svg?style=flat" alt="license"></a>
  </div>
</h1>

<div align="center"><img height="300" src="https://user-images.githubusercontent.com/1439961/166896857-69bbfbf9-b847-4502-9714-ba9d74c1a97a.gif" /></div>
<h4 align="center">`@mish-tv/sortable-list` is a React component for creating a vertical list UI that can be sorted by drag and drop.</h4>

## Usage

```tsx
import React from "react";
import { RowCreator, SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string; height: number; marginTop: number };

export const Component = (props: { initialIds: number[]; items: Record<number, Item> }) => {
  const [ids, setIds] = React.useState(props.initialIds);

  const row: RowCreator<HTMLLIElement, number> = React.useCallback(
    (id, rowAttributes, handleAttributes, options) => {
      const item = props.items[id];
      let className = "row";
      if (options.isDragging) className += " dragging";

      return (
        <li className={className} {...rowAttributes}>
          <button type="button" {...handleAttributes}>
            ⣿
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
```

## Installation

```
npm install --save @mish-tv/sortable-list
```
