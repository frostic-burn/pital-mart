import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

// Routes that require authentication
const protectedRoutes = ["/account", "/checkout"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get("customer_token")?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      // Verify the token
      await verifyToken(token)
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("customer_token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
}
