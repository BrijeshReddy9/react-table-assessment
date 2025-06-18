# React Table Assignment (with TypeScript)

This project implements a high-performance, interactive table in React with **two implementations**:

- ✅ `DataTable`: built using powerful open-source libraries (`@tanstack/react-table`, `dnd-kit`, `react-window`)
- ✅ `Table`: built from scratch using native React, drag-and-drop APIs, and `react-window` only for row virtualization

---

## 📦 Libraries Used

| Library | Purpose |
|--------|---------|
| [`@faker-js/faker`](https://github.com/faker-js/faker) | Generate fake user data |
| [`@tanstack/react-table`](https://tanstack.com/table) | Headless table logic with sorting and column control |
| [`react-window`](https://github.com/bvaughn/react-window) | Efficiently render only visible rows |
| [`dnd-kit`](https://dndkit.com/) | Drag-and-drop for column reordering |
| [`Vite`](https://vitejs.dev/) | Fast build & dev environment |
| TypeScript | Type safety throughout the project |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Runs on: `http://localhost:3000`

Both versions of the table are rendered on the page:

- 🔹 `<DataTable />`: library-powered version
- 🔹 `<TableWithoutLibraries />`: custom native version

---

## 🧠 Project Structure

```
src/
├── components/
│   ├── DataTable.tsx             # Table using @tanstack/react-table + dnd-kit
│   ├── Table.tsx # Native React version (no table/dnd libraries)
├── hooks/
│   └── useFakeData.ts            # Generates fake user data
├── App.tsx                       # Shows both table components
├── main.tsx                      # ReactDOM entry
```

---

## 📊 Data Generation

- Uses `@faker-js/faker` to generate fake:
  - First name, Last name
  - Email
  - City
  - Registered date
- Computed fields (used in the DataTable version):
  - `fullName = first + last`
  - `dsr = Days since registration`

---

## 🧩 DataTable: Feature Logic (Library Version)

### 📊 Table Logic

- Built with `@tanstack/react-table`
- Defines schema and handles sorting
- `columnOrder` controls drag-and-drop order

### 🧲 Drag-and-Drop (`dnd-kit`)
- Uses `useSortable` per column
- Drag handlers update `columnOrder` using `arrayMove`

### ⚡ Virtual Scrolling
- Renders only visible rows using `react-window`'s `FixedSizeList`

---

## 🔁 TableWithoutLibraries: Native React Version

This component rebuilds everything **without table libraries**:

- ✅ Native `HTML5` drag-and-drop events (`dragstart`, `dragover`, `drop`)
- ✅ Click-to-sort with direction toggling (`asc` / `desc`)
- ✅ Column reordering using state-controlled `columnOrder: ColumnKey[]`
- ✅ `react-window` still used to handle large lists efficiently
- ✅ Layout built entirely with `div`s + Flexbox for virtualization compatibility

---

## ✅ Feature Comparison

| Feature              | DataTable        | TableWithoutLibraries |
|---------------------|------------------|------------------------|
| Sorting             | ✅ via react-table | ✅ native logic        |
| Column Drag         | ✅ via dnd-kit     | ✅ native drag/drop    |
| Virtualized Rows    | ✅ react-window   | ✅ react-window        |
| Column Reorderable  | ✅                | ✅                    |
| Fake Data           | ✅ faker          | ✅ faker               |
| TypeScript Support  | ✅                | ✅                    |

---

## 🔁 Infinite or Occlusion Scroll Considerations (My Approach)

When working with large datasets, I prioritized performance and responsiveness. I chose to implement **occlusion scrolling** (a.k.a. virtual scrolling) using `react-window` because it only renders visible rows rather than loading the entire dataset into the DOM.

---

### ⚙️ Why I Chose Occlusion Scrolling

Occlusion scrolling helps address key performance concerns:

- 🧠 Reduces memory usage by limiting DOM nodes
- 🚀 Improves scroll performance with large datasets
- 🪶 Keeps the UI responsive, even with 1000+ rows

Since I was generating a fixed number of fake records using `faker`, true infinite scroll wasn’t necessary for this use case.

---

### 🧱 How I Integrated `react-window`

I used the `FixedSizeList` component from `react-window` to render only a small portion of rows at a time:

```tsx
<FixedSizeList
  height={400}
  itemSize={40}
  itemCount={data.length}
  width="100%"
>
  {RowRenderer}
</FixedSizeList>
```

Rows are rendered as `div` containers using flex layout to maintain compatibility with virtualization.

---

### 🤝 Integration with `@tanstack/react-table`

For the library-based implementation (`DataTable`), I used `@tanstack/react-table` to manage sorting, column order, and row models. It seamlessly integrates with `react-window` by passing the final row list into the virtualized component.

This gave me the best of both worlds:

- ✅ Headless table logic from `@tanstack/react-table`
- ✅ High-performance rendering from `react-window`

---

### 🔄 Infinite Scroll (Optional)

While infinite scrolling wasn’t needed here, I designed the system so it could easily support it in the future. For example:

- Use `onItemsRendered` from `react-window` to detect scroll end
- Fetch additional rows from a backend
- Append the new data into the current dataset

This pattern would work in both custom and library-based versions.

---

### 🧠 Summary of My Considerations

| Concern                         | My Solution                            |
|----------------------------------|----------------------------------------|
| Handling large datasets          | Used `react-window` for virtualization |
| Minimizing DOM nodes             | Rendered only visible rows             |
| Keeping UI responsive            | Lightweight rendering strategy         |
| Working with table logic         | Integrated with `@tanstack/react-table` |
| Future scalability (infinite scroll) | Easily extendable with scroll events  |
