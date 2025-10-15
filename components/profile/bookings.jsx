'use client';
import BrLayout from './brLayout';
import { useMemo } from 'react';
import { createColumnHelper, flexRender, getPaginationRowModel, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import Button from '@/components/common/button.jsx'
import { format, isValid } from 'date-fns';

const Bookings = ({ bookings, error }) => {
  console.log('bookings:', bookings);

  // Define columns based on booking structure, excluding _id, companyId, __v
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('bookingId', { header: 'Booking ID' }),
      columnHelper.accessor('charges', { header: 'Charges' }),
      columnHelper.accessor('class', { header: 'Class' }),
      columnHelper.accessor('corporateName', { header: 'Corporate Name' }),
      // columnHelper.accessor('createdAt', {
      //   header: 'Created At',
      //   cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      // }),
      columnHelper.accessor('dateOfBooking', {
        header: 'Date of Booking',
        cell: (info) => {
          const date = new Date(info.getValue());
          return isValid(date) ? format(date, 'dd-MM-yyyy') : 'Invalid Date';
        },
      }),
      columnHelper.accessor('dateOfTravel', {
        header: 'Date of Travel',
        cell: (info) => {
          const date = new Date(info.getValue());
          return isValid(date) ? format(date, 'dd-MM-yyyy') : 'Invalid Date';
        },
      }),
      columnHelper.accessor('destinationStn', { header: 'Destination Station' }),
      columnHelper.accessor('entityName', { header: 'Entity Name' }),
      columnHelper.accessor('gst18', { header: 'GST (18%)' }),
      columnHelper.accessor('gstNo', { header: 'GST Number' }),
      columnHelper.accessor('invoiceNo', { header: 'Invoice Number' }),
      columnHelper.accessor('noOfPax', { header: 'No. of Passengers' }),
      columnHelper.accessor('nttBillNo', { header: 'NTT Bill Number' }),
      columnHelper.accessor('originStn', { header: 'Origin Station' }),
      columnHelper.accessor('passengerName', { header: 'Passenger Name' }),
      columnHelper.accessor('pnrTicket', { header: 'PNR Ticket' }),
      columnHelper.accessor('quota', { header: 'Quota' }),
      columnHelper.accessor('sNo', { header: 'Serial Number' }),
      columnHelper.accessor('sector', { header: 'Sector' }),
      columnHelper.accessor('statementPeriod', { header: 'Statement Period' }),
      columnHelper.accessor('ticketAmount', { header: 'Ticket Amount' }),
      columnHelper.accessor('totalAmount', { header: 'Total Amount' }),
      // columnHelper.accessor('updatedAt', {
      //   header: 'Updated At',
      //   cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      // }),
      columnHelper.accessor('vendeeName', { header: 'Vendee Name' }),
    ],
    [],
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <BrLayout>
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      {error ? (
        <div className="text-red-500 mt-4">{error}</div>
      ) : (
        <div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-left">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </BrLayout>
  );
};

export default Bookings;