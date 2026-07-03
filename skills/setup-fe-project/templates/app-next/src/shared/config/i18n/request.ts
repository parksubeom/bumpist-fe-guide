import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

// Server-side per-request i18n config. next.config.ts points the plugin here.
// Messages live at locales/<code>/<domain>.json — file name = top-level namespace
// (e.g. common.json → t('common.*')). `ko` is the schema SSOT (rules/next/i18n).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../../../locales/${locale}/common.json`)).default,
  }
})
