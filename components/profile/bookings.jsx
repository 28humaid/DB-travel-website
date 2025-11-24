'use client';
import BrLayout from './brLayout';
import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from 'use-debounce';
import Button from '@/components/common/button.jsx';
import FilterControls from '../bookingsNrefunds/filterControls';
import TableHeaderWithFilter from '../bookingsNrefunds/tableHeaderWithFilter';
import { format, isValid, parse, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import TableSum from '../bookingsNrefunds/tableSum';
import ExcelDownloadButton from '../bookingsNrefunds/excelDownloadButton';
// import DateFilterInput from '@/components/bookings/DateFilterInput';
// import DateFilterGroup from '@/components/bookings/DateFilterGroup';


const Bookings = ({ bookings, error }) => {
  console.log('bookings:', bookings);

  // State for filters
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);
  const [tempBookingFrom, setTempBookingFrom] = useState('');
  const [tempBookingTo, setTempBookingTo] = useState('');
  const [tempTravelFrom, setTempTravelFrom] = useState('');
  const [tempTravelTo, setTempTravelTo] = useState('');
  const [bookingFromError, setBookingFromError] = useState('');
  const [bookingToError, setBookingToError] = useState('');
  const [travelFromError, setTravelFromError] = useState('');
  const [travelToError, setTravelToError] = useState('');

  const formatToMMMYYYY = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in a recognizable date format, parse and format it
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM-yyyy') : '';
  };
  
  // Define columns
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('serial_no', {
        header: 'S. No.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('date_of_booking', {
        header: 'Date of Booking',
        cell: (info) => {
          const date = new Date(info.getValue());
          return isValid(date) ? format(date, 'dd-MM-yyyy') : 'Invalid Date';
        },
        filterFn: (row, columnId, filterValue) => {
          const rowDate = new Date(row.getValue(columnId));
          if (!isValid(rowDate)) return false;
          if (typeof filterValue === 'string' && filterValue) {
            const parsedFilter = parse(filterValue, 'dd-MM-yyyy', new Date());
            if (!isValid(parsedFilter)) return true;
            return format(rowDate, 'dd-MM-yyyy') === filterValue;
          } else if (Array.isArray(filterValue) && filterValue.length === 2) {
            const [from, to] = filterValue;
            if (!isValid(from) || !isValid(to)) return true;
            return isWithinInterval(rowDate, { start: from, end: to });
          }
          return true;
        },
      }),
      columnHelper.accessor('pnr_ticket_no', {
        header: 'PNR/Ticket #',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('date_of_travel', {
        header: 'Date of Travel',
        cell: (info) => {
          const date = new Date(info.getValue());
          return isValid(date) ? format(date, 'dd-MM-yyyy') : 'Invalid Date';
        },
        filterFn: (row, columnId, filterValue) => {
          const rowDate = new Date(row.getValue(columnId));
          if (!isValid(rowDate)) return false;
          if (typeof filterValue === 'string' && filterValue) {
            const parsedFilter = parse(filterValue, 'dd-MM-yyyy', new Date());
            if (!isValid(parsedFilter)) return true;
            return format(rowDate, 'dd-MM-yyyy') === filterValue;
          } else if (Array.isArray(filterValue) && filterValue.length === 2) {
            const [from, to] = filterValue;
            if (!isValid(from) || !isValid(to)) return true;
            return isWithinInterval(rowDate, { start: from, end: to });
          }
          return true;
        },
      }),
      columnHelper.accessor('passengerName', {
        header: 'Passenger Name',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('sector', {
        header: 'Sector',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('origin_stn', {
        header: 'Origin Stn.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('destination_stn', {
        header: 'Destination Stn.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('class', {
        header: 'Class',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('quota', {
        header: 'Quota',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('no_of_pax', {
        header: 'No. of Pax',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('ticket_amount', {
        header: 'Ticket Amount',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('s_charges', {
        header: 'S. Charges',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('gst_18', {
        header: 'GST (18%)',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('total_amount', {
        header: 'Total Amount',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('booking_id', {
        header: 'Booking ID',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('vendee_corporate', {
        header: 'Vendee/Corporate',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('sub_corporate', {
        header: 'Sub-Corporate',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('sub_entity', {
        header: 'Sub-Entity',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('ntt_bill_no', {
        header: 'NTT Bill No.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('invoice_no', {
        header: 'Invoice No.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('statement_period', {
        header: 'Statement Period',
        cell: (info) => {
          const value = info.getValue();
          return formatToMMMYYYY(value);
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          
          const rowValue = row.getValue(columnId);
          
          // Skip empty cells when filtering
          if (!rowValue || rowValue.toString().trim() === '') {
            return false;
          }
          
          const formattedValue = formatToMMMYYYY(rowValue);
          
          // Search in both the formatted text and original value
          return formattedValue.toLowerCase().includes(filterValue.toLowerCase()) || 
                rowValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        },
      }),
      columnHelper.accessor('gst_no', {
        header: 'GST No.',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('gst_state', {
        header: 'GST State',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('cgst_9', {
        header: 'CGST %9',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('sgst_9', {
        header: 'SGST % 9',
        filterFn: 'includesString',
      }),
      columnHelper.accessor('igst_18', {
        header: 'IGST % 18',
        filterFn: 'includesString',
      }),
    ],
    [],
  );

  // Handle date search button click
  const handleDateSearch = () => {
    const newFilters = [];
    const parseDate = (value) => {
      if (typeof value !== 'string' || !value) return null;
      return parse(value, 'dd-MM-yyyy', new Date());
    };

    // Validate and set Date of Booking range
    const bookingFrom = parseDate(tempBookingFrom);
    const bookingTo = parseDate(tempBookingTo);
    setBookingFromError(tempBookingFrom && !isValid(bookingFrom) ? 'Invalid Date' : '');
    setBookingToError(tempBookingTo && !isValid(bookingTo) ? 'Invalid Date' : '');
    if (bookingFrom && isValid(bookingFrom) && bookingTo && isValid(bookingTo)) {
      newFilters.push({ id: 'date_of_booking', value: [startOfDay(bookingFrom), endOfDay(bookingTo)] });
    } else if (bookingFrom && isValid(bookingFrom)) {
      newFilters.push({ id: 'date_of_booking', value: [startOfDay(bookingFrom), endOfDay(bookingFrom)] });
    } else if (bookingTo && isValid(bookingTo)) {
      newFilters.push({ id: 'date_of_booking', value: [startOfDay(bookingTo), endOfDay(bookingTo)] });
    }

    // Validate and set Date of Travel range
    const travelFrom = parseDate(tempTravelFrom);
    const travelTo = parseDate(tempTravelTo);
    setTravelFromError(tempTravelFrom && !isValid(travelFrom) ? 'Invalid Date' : '');
    setTravelToError(tempTravelTo && !isValid(travelTo) ? 'Invalid Date' : '');
    if (travelFrom && isValid(travelFrom) && travelTo && isValid(travelTo)) {
      newFilters.push({ id: 'date_of_travel', value: [startOfDay(travelFrom), endOfDay(travelTo)] });
    } else if (travelFrom && isValid(travelFrom)) {
      newFilters.push({ id: 'date_of_travel', value: [startOfDay(travelFrom), endOfDay(travelFrom)] });
    } else if (travelTo && isValid(travelTo)) {
      newFilters.push({ id: 'date_of_travel', value: [startOfDay(travelTo), endOfDay(travelTo)] });
    }

    // Preserve existing text column filters
    const existingTextFilters = columnFilters.filter(
      (f) => f.id !== 'date_of_booking' && f.id !== 'date_of_travel',
    );
    setColumnFilters([...existingTextFilters, ...newFilters]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setGlobalFilter('');
    setColumnFilters([]);
    setTempBookingFrom('');
    setTempBookingTo('');
    setTempTravelFrom('');
    setTempTravelTo('');
    setBookingFromError('');
    setBookingToError('');
    setTravelFromError('');
    setTravelToError('');
  };

  // Initialize TanStack Table
  const table = useReactTable({
    data: bookings,
    columns,
    state: { globalFilter: debouncedGlobalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const pnr = row.getValue('pnr_ticket_no')?.toString().toLowerCase() || '';
      const bookingId = row.getValue('booking_id')?.toString().toLowerCase() || '';
      return pnr.includes(filterValue.toLowerCase()) || bookingId.includes(filterValue.toLowerCase());
    },
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <BrLayout heading="Bookings">
      {error ? (
        <div className="text-red-500 mt-4">{error}</div>
      ) : (
        <div>
          <FilterControls
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            tempBookingFrom={tempBookingFrom}
            setTempBookingFrom={setTempBookingFrom}
            tempBookingTo={tempBookingTo}
            setTempBookingTo={setTempBookingTo}
            tempTravelFrom={tempTravelFrom}
            setTempTravelFrom={setTempTravelFrom}
            tempTravelTo={tempTravelTo}
            setTempTravelTo={setTempTravelTo}
            bookingFromError={bookingFromError}
            setBookingFromError={setBookingFromError}
            bookingToError={bookingToError}
            setBookingToError={setBookingToError}
            travelFromError={travelFromError}
            setTravelFromError={setTravelFromError}
            travelToError={travelToError}
            setTravelToError={setTravelToError}
            handleDateSearch={handleDateSearch}
            handleResetFilters={handleResetFilters}
          >
            <ExcelDownloadButton
              table={table}
              columns={columns}
              filename="bookings.xlsx"
              greetingsMessage="Thank you for using our system!"
            />
          </FilterControls>
          <TableSum table={table} columnAccessor="total_amount" label="Total Amount" />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHeaderWithFilter
                        key={header.id}
                        header={header}
                        isDateColumn={['date_of_booking', 'date_of_travel'].includes(header.column.id)}
                      />
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="primary"
              size="medium"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="primary"
              size="medium"
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