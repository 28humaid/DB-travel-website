import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow login page
  if (pathname === "/") {
    if (token) {
      // Already logged in → redirect to profile
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes (normal user routes)
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Match all routes except Next.js internals
export const config = {
  // matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
    matcher: ["/profile"],
};
