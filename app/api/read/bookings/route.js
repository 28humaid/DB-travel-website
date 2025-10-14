import { connectMongoDB } from "@/lib/mongodb";
import { getAuthSession } from "@/lib/getAuthSession";
import Booking from "@/models/bookingsSchema"; // Adjust path if needed
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get authenticated session
    const session = await getAuthSession(request);
    if (!session) {
      throw new Error("Authentication failed. Please log in again.");
    }

    const companyId = session.user.id; // companyName from session

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch bookings for the company
    const bookings = await Booking.find({ companyId: companyId }).lean();

    if (!bookings || bookings.length === 0) {
      throw new Error("No bookings found for this company.");
    }

    return NextResponse.json(
      { message: "Bookings retrieved successfully", data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    if (error.message.includes("Authentication failed")) {
      return NextResponse.json(
        { message: "Authentication failed. Please log in again." },
        { status: 401 }
      );
    } else if (error.message.includes("Error 404")) {
      return NextResponse.json(
        { message: "No bookings found for this company (Error 404)." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Server error (Error 500). Please try again later." },
      { status: 500 }
    );
  }
}