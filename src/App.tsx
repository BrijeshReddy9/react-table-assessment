import React, { useMemo } from 'react';
import DataTable from './components/DataTable';
import { generateFakeUsers } from './hooks/useFakeData';
import { ColumnDef } from '@tanstack/react-table';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: string;
};

const App: React.FC = () => {
  const data = useMemo(() => generateFakeUsers(500), []);

  const columns = useMemo<ColumnDef<User>[]>(() => [
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'firstName', header: 'First Name', enableSorting: true },
    { accessorKey: 'lastName', header: 'Last Name', enableSorting: true },
    {
      id: 'fullName',
      header: 'Full Name',
      accessorFn: row => `${row.firstName} ${row.lastName}`,
      enableSorting: true
    },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    { accessorKey: 'city', header: 'City', enableSorting: true },
    {
      accessorKey: 'registeredDate',
      header: 'Registered Date',
      enableSorting: true
    },
    {
      id: 'dsr',
      header: 'DSR',
      accessorFn: row => 
        Math.floor(
          (Date.now() - new Date(row.registeredDate).getTime()) /
          (1000 * 60 * 60 * 24)
        ),
      enableSorting: true
    }
  ], []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Virtualized Sortable Table</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default App