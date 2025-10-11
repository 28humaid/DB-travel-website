import React from 'react';
import BrLayout from './brLayout';

const Refunds = ({ refunds, error }) => {
  return (
    <BrLayout>
      <h2>Refunds</h2>
      {error ? (
        <div className="text-red-500 mt-4">Error: {error}</div>
      ) : (
        <ul>
          {refunds.map((refund) => (
            <li key={refund._id}>{refund.pnrNo || "Refund"} - {refund.companyId}</li>
          ))}
        </ul>
      )}
    </BrLayout>
  );
};

export default Refunds;