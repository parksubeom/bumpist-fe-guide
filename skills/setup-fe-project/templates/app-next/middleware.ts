import createMiddleware from 'next-intl/middleware'

import { routing } from '@/shared/config/i18n/routing'

// Locale negotiation + `/[locale]/...` routing (rules/next/i18n).
export default createMiddleware(routing)

export const config = {
  // Skip Next internals and static assets; run on everything else.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
