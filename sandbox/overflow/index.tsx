import React from "react";
import { createRoot } from "react-dom/client";

import { Component } from "./component";

const bodies = ["foo", "bar", "baz"];
const items = Array(50)
	.fill(0)
	.map((_, i) => ({ id: i, body: `${i} ${bodies[i % 3]}` }));
const ids = Array(50)
	.fill(0)
	.map((_, i) => i);

export const App = () => (
	<div className="wrapper">
		<Component initialIds={ids} items={items} />
	</div>
);

const container = document.getElementById("root");
if (container) {
	createRoot(container).render(<App />);
}
