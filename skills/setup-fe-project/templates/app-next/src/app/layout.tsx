// Root layout — thin: sets <html lang>, loads server messages, mounts Providers.
// Route screens live in src/pages/* slices; page.tsx assembles them
// (rules/next/project-structure, routing).
import { hasLocale } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Providers } from './providers'

import { routing } from '@/shared/config/i18n/routing'

import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  if (!hasLocale(routing.locales, locale)) notFound()

  // Resolved on the server and handed to the client Providers (no client refetch).
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages as Record<string, unknown>}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
