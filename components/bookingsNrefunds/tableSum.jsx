import { useMemo } from 'react';

const TableSum = ({ table, columnAccessor, label }) => {
  // Calculate the sum of the specified column from filtered rows
  const sum = useMemo(() => {
    return table.getRowModel().rows.reduce((total, row) => {
      const value = row.getValue(columnAccessor);
      // Convert value to number, default to 0 if invalid
      const numericValue = parseFloat(value) || 0;
      return total + numericValue;
    }, 0);
  }, [table.getRowModel().rows, columnAccessor]);

  const getBackgroundColor = () => {
    if (label === "Total Refund Amount") {
      return "bg-red-300";
    } else if (label === "Total Amount") {
      return "bg-green-300";
    }
    return "bg-blue-300"; // default no background color
  };
  return (
    <div className={`my-4 text-lg font-semibold ${getBackgroundColor()}`}>
      {label}: ₹{sum.toFixed(2)}
    </div>
  );
};

export default TableSum;