import * as React from "react";
import * as ReactDOM from "react-dom";
import { RowCreator, SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string; height: number; marginTop: number };
const bodies = ["foo", "bar", "baz"];

const App = () => {
  const [items, setItems] = React.useState<Item[]>(
    Array(50)
      .fill(0)
      .map((_, i) => ({ id: i, body: bodies[i % 3], height: 20 + (i % 3) * 20, marginTop: 5 + (i % 3) * 5 })),
  );

  const row: RowCreator<HTMLLIElement, Item> = React.useCallback(
    (item, rowAttributes, handleAttributes) => (
      <li className="row" {...rowAttributes} style={{ ...rowAttributes.style, height: item.height, marginTop: item.marginTop }}>
        <button type="button" {...handleAttributes}>
          ⣿
        </button>
        <span>{item.id}</span>
        <span>{item.body}</span>
      </li>
    ),
    [],
  );

  return (
    <ul className="list">
      <SortableList items={items} setItems={setItems} row={row} />
    </ul>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
