import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminPaths, doctorPaths } from './utils/paths'
import { Role } from './types/auth.types'

export const config = {
  runtime: 'nodejs',
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)",
  ],
}

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api/v1"

export async function middleware(request: NextRequest) {

  const token = request.cookies.get("auth_token")
  const pathname = request.nextUrl.pathname

  if (pathname == "/login" || pathname == "/register") return NextResponse.next()

  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Cookie": `auth_token=${token?.value};`
    }
  })

  const user = await response.json()
  if (!user?.data || !user.success) return NextResponse.redirect(new URL("/login", request.url))

  if (user.data.role === Role.ADMIN) {
    if (!adminPaths.find(path => path == pathname)) return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  } else {
    if (!doctorPaths.find(path => path == pathname)) return NextResponse.redirect(new URL("/doctor/dashboard", request.url))
  }

  return NextResponse.next()
}

