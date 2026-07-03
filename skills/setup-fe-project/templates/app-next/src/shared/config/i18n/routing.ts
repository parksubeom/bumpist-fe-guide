import { defineRouting } from 'next-intl/routing'

// Locale routing config, shared by middleware and the navigation helpers.
// Default `ko`, fallback `en` (rules/next/i18n).
export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
})
