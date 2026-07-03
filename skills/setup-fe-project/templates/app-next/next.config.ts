import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

// Points next-intl at the request config (see src/shared/config/i18n/request.ts).
const withNextIntl = createNextIntlPlugin('./src/shared/config/i18n/request.ts')

const nextConfig: NextConfig = {
  // Add project options here (images, redirects, experimental flags, …).
}

export default withNextIntl(nextConfig)
