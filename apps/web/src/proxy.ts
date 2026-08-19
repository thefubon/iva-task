import { defaultLocale } from '@iva360/shared/i18n'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LOCALE_HEADER } from '@/shared/lib/i18n/constants'

function isPassthrough(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  )
}

function getLocaleFromPathname(pathname: string): 'en' | 'ru' | null {
  const segment = pathname.split('/')[1]

  if (segment === 'en') {
    return 'en'
  }

  if (segment === 'ru') {
    return 'ru'
  }

  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPassthrough(pathname)) {
    return NextResponse.next()
  }

  const pathLocale = getLocaleFromPathname(pathname)
  const requestHeaders = new Headers(request.headers)

  if (pathLocale) {
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set(LOCALE_HEADER, pathLocale === 'en' ? 'en' : defaultLocale)
    return response
  }

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/ru${pathname === '/' ? '' : pathname}`

  const response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
  response.headers.set(LOCALE_HEADER, defaultLocale)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
