import { connectMongoDB } from "@/lib/mongodb";
import { getAuthSession } from "@/lib/getAuthSession";
import Refund from "@/models/refundsSchema"; // Adjust path if needed
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get authenticated session
    const session = await getAuthSession(request);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const companyId = session.user.id; // companyName from session

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch refunds for the company
    const refunds = await Refund.find({ companyId: companyId }).lean();

    if (!refunds || refunds.length === 0) {
      return NextResponse.json(
        { message: "No refunds found for this company" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Refunds retrieved successfully", data: refunds },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return NextResponse.json(
      { message: error.message || "Server error (Error 500). Please try again later." },
      { status: 500 }
    );
  }
}