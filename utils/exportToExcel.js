import * as XLSX from 'xlsx';
import { format, isValid } from 'date-fns';

const exportToExcel = (rows, columns, filename, greetingsMessage) => {
  try {
    console.log('XLSX module loaded:', XLSX);
    console.log('Exporting to Excel with:');
    console.log('Rows:', rows);
    console.log('Columns:', columns);
    console.log('Filename:', filename);
    console.log('Greetings Message:', greetingsMessage);

    // Validate XLSX utilities
    if (!XLSX.utils) throw new Error('XLSX.utils is undefined');
    if (!XLSX.utils.aoa_to_sheet) throw new Error('XLSX.utils.aoa_to_sheet is undefined');
    if (!XLSX.utils.book_new) throw new Error('XLSX.utils.book_new is undefined');
    if (!XLSX.utils.book_append_sheet) throw new Error('XLSX.utils.book_append_sheet is undefined');
    if (!XLSX.write) throw new Error('XLSX.write is undefined');

    // Validate browser APIs
    if (!window.Blob || !window.URL || !window.URL.createObjectURL) {
      throw new Error('Required browser APIs (Blob or URL.createObjectURL) are not available.');
    }

    // Validate inputs
    if (!columns || !Array.isArray(columns)) {
      throw new Error('Columns array is invalid or missing');
    }
    if (!rows || !Array.isArray(rows)) {
      throw new Error('Rows array is invalid or missing');
    }

    // Prepare data for Excel
    const data = [];

    // Add greetings message
    data.push([greetingsMessage || 'Thank you for using our system!']);
    data.push([]); // Blank row for spacing

    // Add headers
    const headers = columns.map((column) => column.header || '');
    data.push(headers);

    // Add filtered row data
    rows.forEach((row, rowIndex) => {
      const rowData = columns.map((column, colIndex) => {
        const accessor = column.accessorKey || column.id;
        if (!accessor) {
          console.warn(`Column at index ${colIndex} has no accessorKey or id`, column);
          return 'N/A';
        }
        let value;
        try {
          value = row.getValue(accessor);
        } catch (error) {
          console.warn(`Error accessing value for column ${accessor} in row ${rowIndex}:`, error);
          return 'N/A';
        }
        if (['dateOfBooking', 'dateOfTravel', 'refundDate'].includes(accessor)) {
          const date = new Date(value);
          return isValid(date) ? format(date, 'dd-MM-yyyy') : 'N/A';
        }
        return value ?? 'N/A';
      });
      data.push(rowData);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    console.log('Worksheet created:', ws);

    // Create workbook
    const wb = XLSX.utils.book_new();
    console.log('Workbook created:', wb);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    console.log('Worksheet appended to workbook');

    // Verify workbook structure
    if (!wb.SheetNames || !wb.Sheets || !wb.Sheets['Sheet1']) {
      throw new Error('Invalid workbook structure');
    }

    // Write and download the file with explicit options
    const writeOptions = {
      bookType: 'xlsx',
      type: 'binary',
    };
    console.log('Writing Excel file with options:', writeOptions);
    XLSX.write(wb, writeOptions, filename || 'export.xlsx');
    console.log('Excel file written successfully');
  } catch (error) {
    console.error('Error generating Excel file:', error);
    alert(`Failed to generate Excel file: ${error.message}. Please check the console for details.`);
  }
};

export default exportToExcel;