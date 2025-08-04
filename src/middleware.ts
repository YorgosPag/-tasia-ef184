
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/design-system', request.url))
  }

  if (pathname === '/project-management') {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/project-management'],
}
