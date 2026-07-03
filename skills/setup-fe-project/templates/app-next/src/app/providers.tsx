'use client'

// Client-side providers bundle for the App Router.
// Mounted once from the root `app/layout.tsx` (rules/next/state-and-data, i18n).
//   <html><body><Providers messages={messages} locale={locale}>{children}</Providers></body></html>
import { QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { useState, type ReactNode } from 'react'

import { makeQueryClient } from '@/shared/api/query-client'

interface Props {
  children: ReactNode
  locale: string
  // Messages resolved on the server and handed down (avoids a client refetch).
  messages: Record<string, unknown>
}

export function Providers({ children, locale, messages }: Props) {
  // One QueryClient per browser session — created lazily so it isn't shared
  // across requests on the server.
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}
