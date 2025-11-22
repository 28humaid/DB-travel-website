// app/api/read/refunds/route.js
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/getAuthSession";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get authenticated session
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const clientId = Number(session.user.id); // clientId is Int in MSSQL
    if (isNaN(clientId)) {
      throw new Error("Invalid client ID in session");
    }

    // DIRECTLY USE prisma with where: { clientId }
    const refunds = await prisma.refund.findMany({
      where: { clientId },  // ← FILTER HERE
      orderBy: { serialNo: "asc" },
    });

    // if (!refunds || refunds.length === 0) {
    //   return NextResponse.json(
    //     { message: "No refunds found for this company" },
    //     { status: 404 }
    //   );
    // }

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