import React from "react";
import ReactDOM from "react-dom";

import { Component } from "./component";

const bodies = ["foo", "bar", "baz"];
const items = Array(50)
  .fill(0)
  .map((_, i) => ({ id: i, body: `${i} ${bodies[i % 3]}` }));
const ids = Array(50)
  .fill(0)
  .map((_, i) => i);

export const App = () => <Component initialIds={ids} items={items} />;

ReactDOM.render(<App />, document.getElementById("root"));
