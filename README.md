# React Table Assignment (with TypeScript)

This project implements a high-performance, interactive table in React with:

- 📊 500 rows of **fake data**
- 🔍 **Sorting** by column
- 🧲 **Drag-and-drop column reordering** using `dnd-kit`
- ⚡ **Virtualized scrolling** using `react-window`
- ✅ **TypeScript** and modular structure

---

## 📦 Libraries Used

| Library | Purpose |
|--------|---------|
| [`@faker-js/faker`](https://github.com/faker-js/faker) | Generate 500+ rows of fake user data |
| [`@tanstack/react-table`](https://tanstack.com/table) | Powerful headless table logic with sorting and column control |
| [`react-window`](https://github.com/bvaughn/react-window) | Efficiently render only the visible rows in large lists |
| [`dnd-kit`](https://dndkit.com/) | Enable drag-and-drop for reordering columns |
| [`Vite`](https://vitejs.dev/) | Fast dev server and build tool |
| TypeScript | Ensure type safety and developer confidence |

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

---

## 🧠 Project Structure

```
src/
├── components/
│   └── DataTable.tsx       # Main table with virtualization and drag-drop
├── hooks/
│   └── useFakeData.ts      # Generates fake user data
├── App.tsx                 # Sets up columns and data
├── main.tsx                # ReactDOM entry
```

---

## 🧩 Feature Logic

### 📊 Data Generation (`useFakeData.ts`)
- Uses `faker` to generate names, email, city, and registration date.
- Computes derived fields:
  - `fullName = first + last`
  - `dsr = Days since registration`

### 🧱 Table Logic (`DataTable.tsx`)
- Uses `@tanstack/react-table` for:
  - Defining column schema
  - Sorting on header click
  - Custom column order via drag

### 🧲 Drag-and-Drop (`dnd-kit`)
- Headers are made draggable via `useSortable`
- Column order is controlled by `columnOrder` array
- On drop, the array is updated with `arrayMove`

### ⚡ Virtual Scrolling (`react-window`)
- Renders only the visible rows using `FixedSizeList`
- Handles thousands of rows without slowing down

---

## 📄 Assignment Requirements Coverage

- ✅ 500+ fake rows
- ✅ Columns: ID, First, Last, Full Name, Email, City, Registered Date, DSR
- ✅ Sortable columns
- ✅ Draggable column headers
- ✅ Efficient virtual scrolling

---

## 🛠 Future Enhancements

- Filtering support
- Pagination with backend sync
- Responsive design and row selection

---

## 📬 Author

Built for the take-home React assignment – modular, scalable, and performant.

---

## 🎨 UI Improvements
- Headers styled with better padding and background
- Table cells now have consistent spacing and font
- Hover feedback added for better interactivity
- Sticky headers and alternating row colors recommended for future polish
