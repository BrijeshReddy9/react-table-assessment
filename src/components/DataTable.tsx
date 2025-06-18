import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState
} from '@tanstack/react-table';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FixedSizeList as List } from 'react-window';
import { User } from '../App';

interface Props {
  data: User[];
  columns: ColumnDef<User>[];
}

const DraggableHeader = ({ header }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.id
  });

  const sorted: 'asc' | 'desc' | false = header.column.getIsSorted();

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px 12px',
        borderBottom: '1px solid #ccc',
        background: '#f0f0f0',
        fontWeight: 600,
        fontSize: '14px',
        color: '#333',
        flex: 1,
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div
        onClick={header.column.getToggleSortingHandler()}
        style={{ flex: 1, cursor: 'pointer' }}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''}
      </div>

      <div
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab', paddingLeft: 8 }}
        title="Drag to reorder"
      >
        ⠿
      </div>
    </div>
  );
};

const DataTable: React.FC<Props> = ({ data, columns }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState(() =>
    columns
      .filter((col): col is { accessorKey: string } => 'accessorKey' in col && typeof col.accessorKey === 'string')
      .map((col) => col.accessorKey)
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder
  });

  const sensors = useSensors(useSensor(PointerSensor));
  const headers = table.getHeaderGroups()[0].headers;

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columnOrder.indexOf(active.id);
      const newIndex = columnOrder.indexOf(over.id);
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        overflow: 'auto',
        maxWidth: '100%',
        width: '100%'
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 1 }}>
            {headers.map((header) => (
              <DraggableHeader key={header.id} header={header} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <List
        height={400}
        itemCount={table.getRowModel().rows.length}
        itemSize={40}
        width="100%"
      >
        {({ index, style }) => {
          const row = table.getRowModel().rows[index];
          return (
            <div
              key={row.id}
              style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                background: index % 2 === 0 ? '#fff' : '#f9f9f9',
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  style={{
                    flex: '1 1 150px',
                    padding: '10px 12px',
                    borderBottom: '1px solid #e0e0e0',
                    fontSize: '13px',
                    color: '#222',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0
                  }}                  
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default DataTable;
