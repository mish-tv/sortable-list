<h1 align="center">@mish-tv/sortable-list</h1>

<div align="center">
<a href="https://www.npmjs.com/package/@mish-tv/sortable-list"><img src="https://img.shields.io/npm/v/@mish-tv/sortable-list.svg" alt="npm"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/mish-tv/sortable-list.svg?style=flat" alt="license"></a>
</div>

<h4 align="center">`@mish-tv/sortable-list` is a React component for creating a vertical list UI that can be sorted by drag and drop.</h4>

## Usage

```tsx
type Item = { id: number; body: string };

const Component = (props: { initialItems: Item[] }) => {
  const [items, setItems] = React.useState<Item[]>(props.initialItems);

  const row: RowCreator<HTMLLIElement, Item> = React.useCallback(
    (item, rowAttributes, handleAttributes) => (
      <li className="row" {...rowAttributes}>
        <button type="button" {...handleAttributes}>
          ⣿
        </button>
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
```

## Installation

```
npm install --save @mish-tv/sortable-list
```
