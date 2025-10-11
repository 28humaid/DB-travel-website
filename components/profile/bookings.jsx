import BrLayout from "./brLayout";

const Bookings = ({ bookings, error }) => {
  return (
    <BrLayout>
      <h2>Bookings</h2>
      {error ? (
        <div className="text-red-500 mt-4">Error: {error}</div>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>{booking.pnrTicket || "Booking"} - {booking.companyId}</li>
          ))}
        </ul>
      )}
    </BrLayout>
  );
};

export default Bookings;