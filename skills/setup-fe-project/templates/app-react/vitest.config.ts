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
      // 우리 소스의 스펙만 수집 — `.claude/`(가이드 복사본) 안의 스킬 템플릿 spec까지
      // 집으면 다른 프레임워크 import로 깨진다.
      include: ['src/**/*.spec.{ts,tsx}'],
      // Playwright owns everything under `e2e/`.
      exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**'],
      // 부트스트랩 직후 스펙 0개는 실패가 아니다.
      passWithNoTests: true,
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
