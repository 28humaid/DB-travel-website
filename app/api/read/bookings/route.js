// app/api/read/bookings/route.js
import { prisma } from "@/lib/prisma";  // ← ONLY prisma
import { getAuthSession } from "@/lib/getAuthSession";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication failed. Please log in again." },
        { status: 401 }
      );
    }

    const clientId = Number(session.user.id);
    if (isNaN(clientId)) {
      throw new Error("Invalid client ID in session");
    }

    // DIRECTLY USE prisma with where: { clientId }
    const bookings = await prisma.booking.findMany({
      where: { clientId },  // FILTER HERE
      orderBy: { serialNo: "asc" },
    });

    // if (!bookings || bookings.length === 0) {
    //   return NextResponse.json(
    //     { message: "No bookings found for this company (Error 404)." },
    //     { status: 404 }
    //   );
    // }

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
    }

    // if (error.message.includes("404")) {
    //   return NextResponse.json(
    //     { message: "No bookings found for this company (Error 404)." },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(
      { message: "Server error (Error 500). Please try again later." },
      { status: 500 }
    );
  }
}