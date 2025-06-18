import React, { useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import { FixedSizeList as List } from 'react-window';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  city: string;
  registeredAt: string;
  dsr: number;
};

const initialColumns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'City' },
  { key: 'registeredAt', label: 'Registered Date' },
  { key: 'dsr', label: 'DSR' }
] as const;

type ColumnKey = typeof initialColumns[number]['key'];

const generateUsers = (count = 1000): User[] =>
  Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registeredAt = faker.date.past({ years: 2 });
    const now = new Date();
    const dsr = Math.floor((now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: i + 1,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email(),
      city: faker.location.city(),
      registeredAt: registeredAt.toISOString().split('T')[0],
      dsr
    };
  });

const TableWithoutLibraries = () => {
  const [users] = useState(generateUsers());
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(initialColumns.map(col => col.key));
  const [sortConfig, setSortConfig] = useState<{ key: ColumnKey; direction: 'asc' | 'desc' } | null>(null);
  const [draggedCol, setDraggedCol] = useState<ColumnKey | null>(null);
  const [hoverCol, setHoverCol] = useState<ColumnKey | null>(null);

  const sortedUsers = useMemo(() => {
    if (!sortConfig) return users;

    const { key, direction } = sortConfig;
    return [...users].sort((a, b) => {
      const valA = String(a[key]).toLowerCase();
      const valB = String(b[key]).toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig]);

  const handleSort = (key: ColumnKey) => {
    setSortConfig(prev =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const getSortIndicator = (key: ColumnKey) => {
    if (sortConfig?.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
  };

  const handleDragStart = (e: React.DragEvent, key: ColumnKey) => {
    setDraggedCol(key);
    e.dataTransfer.setData('text/plain', key);
  };

  const handleDrop = (e: React.DragEvent, targetKey: ColumnKey) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain') as ColumnKey;

    if (!sourceKey || sourceKey === targetKey) return;

    const newOrder = [...columnOrder];
    const from = newOrder.indexOf(sourceKey);
    const to = newOrder.indexOf(targetKey);

    newOrder.splice(from, 1);
    newOrder.splice(to, 0, sourceKey);
    setColumnOrder(newOrder);
    setDraggedCol(null);
    setHoverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, targetKey: ColumnKey) => {
    e.preventDefault();
    if (draggedCol !== targetKey) {
      setHoverCol(targetKey);
    }
  };

  const handleDragEnd = () => {
    setDraggedCol(null);
    setHoverCol(null);
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = sortedUsers[index];
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          background: index % 2 === 0 ? '#fff' : '#f9f9f9',
          borderBottom: '1px solid #eee'
        }}
      >
        {columnOrder.map(key => (
          <div
            key={key}
            style={{
              flex: 1,
              padding: '10px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {user[key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: 20, overflowX: 'auto' }}>
      <h2>Virtualized Table with Drag & Sort</h2>

      <div style={{ display: 'flex', background: '#f8f8f8', fontWeight: 'bold' }}>
        {columnOrder.map(key => {
          const col = initialColumns.find(c => c.key === key)!;
          const isDragged = draggedCol === key;
          const isHovered = hoverCol === key;

          return (
            <div
              key={key}
              draggable
              onDragStart={e => handleDragStart(e, key)}
              onDragOver={e => handleDragOver(e, key)}
              onDrop={e => handleDrop(e, key)}
              onDragEnd={handleDragEnd}
              onClick={() => handleSort(key)}
              style={{
                flex: 1,
                padding: '10px',
                background: isDragged
                  ? '#d0f0ff'
                  : isHovered
                  ? '#e6f7ff'
                  : '#f0f0f0',
                borderBottom: '1px solid #ccc',
                cursor: 'grab',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {col.label}
              {getSortIndicator(key)}
            </div>
          );
        })}
      </div>

      <List
        height={400}
        itemCount={sortedUsers.length}
        itemSize={40}
        width={'100%'}
      >
        {Row}
      </List>
    </div>
  );
};

export default TableWithoutLibraries;
