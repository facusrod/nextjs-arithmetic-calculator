import { OperationAPI } from '@/network/api';
import { Record } from '@/network/types';
import { NextPage } from 'next';
import router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  Column,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: any;
}) => {
  const count = preFilteredRows.length;
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
      className="p-2 border rounded w-full"
    />
  );
};

const Account: NextPage = () => {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const columns: Column<Record>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        disableFilters: true,
      },
      {
        Header: 'Operation',
        accessor: 'type',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Balance',
        accessor: 'user_balance',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original.id)}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        ),
        disableFilters: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize, pageIndex }
  }: any = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount
    } as any,
    useFilters,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    //Redirect to account page if authenticated
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const { records, totalRows } = await OperationAPI.findAll(pageIndex, pageSize);
        setData(records);
        setPageCount(Math.ceil(totalRows / pageSize));
        setLoading(false);
      } catch (err) {
        console.error(err); // Manejar el error aquí según sea necesario
        setLoading(false);
      }
    };

    // Llama la función asincrónica al cargar el componente o cuando cambien pageIndex y pageSize
    fetchData();
  }, [pageIndex, pageSize]);

  const deleteRecord = (id: number) => {
    OperationAPI
    .delete(id)
    .then(() => {
      setData((prevData) => prevData.filter((record) => record.id !== id));
    }).catch(err => console.error('Error deleting record:', err.response.data.message))
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Records</h1>
      <table {...getTableProps()} className="min-w-full bg-white rounded-lg">
        <thead>
          {headerGroups.map((headerGroup: any, index: number) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, index: number) => (
                <th key={index}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-4 border-b text-left"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                Loading...
              </td>
            </tr>
          ) : (
            page.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => (
                    <td key={index} {...cell.getCellProps()} className="py-2 px-4 border-b">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-2 border rounded disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-2 border rounded disabled:opacity-50 mx-2"
          >
            {'<'}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-2 border rounded disabled:opacity-50 mx-2"
          >
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="p-2 border rounded disabled:opacity-50"
          >
            {'>>'}
          </button>
        </div>
        <div>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="p-2 border rounded"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Account;