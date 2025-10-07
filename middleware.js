import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Handle login page (now runs because / is in matcher)
  if (pathname === "/") {
    if (token) {
      // Already logged in → redirect directly to profile/[slug] to avoid chain
      const userName = token.name; // This is your companyName from DB
      if (userName) {
        return NextResponse.redirect(new URL(`/profile/${userName}`, req.url));
      }
      // Fallback if no name (edge case, e.g., DB issue)
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  // Protect profile routes (and any other non-/ paths if token missing)
  if (!token && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Now includes / for login redirect, plus profile protection
export const config = {
  matcher: ['/', '/profile/:path*'],
};