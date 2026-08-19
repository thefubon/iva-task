import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'

import { defaultLocale, resolveLocaleParam } from '@iva360/shared/i18n'

import { LOCALE_HEADER } from '@/shared/lib/i18n/constants'
import { AppThemeProvider } from './providers'

import './assets/css/globals.css'

export const metadata: Metadata = {
  applicationName: 'IVA360',
  description: 'IVA 360',
  title: 'IVA360',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f14' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headersList = await headers()
  const locale = resolveLocaleParam(headersList.get(LOCALE_HEADER) ?? defaultLocale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  )
}
