import react from '@vitejs/plugin-react'
import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// Next.js has no Vite config, so Vitest gets its own minimal one.
// `vite-tsconfig-paths` reuses the `@/*` alias from tsconfig.json.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Component/unit specs live next to source as `*.spec.tsx`.
    // Playwright owns everything under `e2e/`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/shared/api/schema.d.ts',
      ],
    },
  },
})
