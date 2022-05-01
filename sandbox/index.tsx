import * as React from "react";
import * as ReactDOM from "react-dom";
import { RowCreator, SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string };
const bodies = ["foo", "bar", "baz"];

const App = () => {
  const [items] = React.useState<Item[]>(
    Array(100)
      .fill(0)
      .map((_, i) => ({ id: i, body: bodies[i % 3] })),
  );

  const row: RowCreator<HTMLTableRowElement, Item> = React.useCallback(
    (item, rowAttributes, handleAttributes) => (
      <tr {...rowAttributes}>
        <td>
          <button type="button" {...handleAttributes}>
            ⣿
          </button>
        </td>
        <td>{item.id}</td>
        <td>{item.body}</td>
      </tr>
    ),
    [],
  );

  return (
    <table>
      <tbody>
        <SortableList items={items} row={row} />
      </tbody>
    </table>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
