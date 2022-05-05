import * as React from "react";
import * as ReactDOM from "react-dom";
import { RowCreator, SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string; height: number; marginTop: number };
const bodies = ["foo", "bar", "baz"];
const items: Item[] = Array(50)
  .fill(0)
  .map((_, i) => ({ id: i, body: bodies[i % 3], height: 20 + (i % 3) * 20, marginTop: 5 + (i % 3) * 5 }));

const App = () => {
  const [ids, setIds] = React.useState(
    Array(50)
      .fill(0)
      .map((_, i) => i),
  );

  const row: RowCreator<HTMLLIElement, number> = React.useCallback((id, rowAttributes, handleAttributes) => {
    const item = items[id];

    return (
      <li className="row" {...rowAttributes} style={{ ...rowAttributes.style, height: item.height, marginTop: item.marginTop }}>
        <button type="button" {...handleAttributes}>
          ⣿
        </button>
        <span>{item.id}</span>
        <span>{item.body}</span>
      </li>
    );
  }, []);

  return (
    <ul className="list">
      <SortableList ids={ids} setIds={setIds} row={row} />
    </ul>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
