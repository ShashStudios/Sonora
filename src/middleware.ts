import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Sonora
 * No authentication required for hackathon demo
 */
export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // Add authentication later with Clerk or NextAuth if needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
