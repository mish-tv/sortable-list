import * as React from "react";
import * as ReactDOM from "react-dom";
import { SortableList } from "@mish-tv/sortable-list";

type Item = { id: number; body: string };

const App = () => {
  const [items] = React.useState<Item[]>([
    { id: 1, body: "hello" },
    { id: 2, body: "world" },
  ]);
  const cell = React.useCallback(
    (item: Item) => (
      <tr>
        <td>{item.id}</td>
        <td>{item.body}</td>
      </tr>
    ),
    [],
  );

  return (
    <table>
      <tbody>
        <SortableList items={items} cell={cell} />
      </tbody>
    </table>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
