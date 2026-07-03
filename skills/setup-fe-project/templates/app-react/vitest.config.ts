import { fileURLToPath } from 'node:url'

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

// Reuses the Vite resolve/alias config so tests import exactly like the app.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      // `@testing-library/jest-dom` matchers + cleanup between tests.
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
      // Unit/component specs live next to source as `*.spec.tsx`.
      // Playwright owns everything under `e2e/`.
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.spec.{ts,tsx}',
          'src/**/*.stories.{ts,tsx}',
          'src/shared/api/schema.d.ts',
          'src/main.tsx',
        ],
      },
    },
  }),
)
