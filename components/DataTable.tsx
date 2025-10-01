import { JSX } from 'preact';
import { Css } from '@common/ui/css';
import { useMemo } from 'preact/hooks';
import { DivProps } from './types';

const c = Css('DataTable', {
  '': {
    border: 0,
    borderCollapse: 'collapse',
    m: 0.5,
  },
});

export type DataTableCol<T> = {

}

// default w = 100

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', w: 70 },
  { field: 'firstName', headerName: 'First name', w: 130 },
  { field: 'lastName', headerName: 'Last name', w: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export interface DataTableProps<T = any> extends DivProps {
    columns: DataTableCol<T>[],
    rows: T[],
}

export interface IDataTable {
    <T>(props: DataTableProps<T>): JSX.Element;
}

export const DataTable = (({ columns, rows, ...props }: DataTableProps) => {
    const totalW = useMemo(() => {

    }, []);
    
    return (
        <div {...props} class={c('', props)}>

        </div>
    );
}) as IDataTable
