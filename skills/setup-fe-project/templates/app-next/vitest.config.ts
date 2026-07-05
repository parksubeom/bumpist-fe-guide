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
    // 우리 소스의 스펙만 수집한다. include를 src로 한정하지 않으면 `.claude/` 안의
    // 스킬 템플릿(예: Vue 예제 spec)까지 집어 다른 프레임워크 import로 깨진다.
    include: ['src/**/*.spec.{ts,tsx}'],
    // Playwright owns everything under `e2e/`; `.claude/`는 가이드 복사본.
    exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**'],
    // 부트스트랩 직후엔 스펙이 없을 수 있다 — 스펙 0개는 실패가 아니다.
    passWithNoTests: true,
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
