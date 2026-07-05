import { defineConfig, globalIgnores } from 'eslint/config'
import skipFormatting from 'eslint-config-prettier/flat'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import pluginBoundaries from 'eslint-plugin-boundaries'
import pluginImportX from 'eslint-plugin-import-x'
import pluginOxlint from 'eslint-plugin-oxlint'
import tseslint from 'typescript-eslint'

// Flat-config 네이티브 스택. eslint-config-next + FlatCompat 브리지는 쓰지 않는다 —
// eslint 9 + pnpm(strict node_modules) 조합에서 파일 단위 실행(lint-staged)이 깨지는
// 마찰이 실전에서 확인됐다. TypeScript 규칙은 typescript-eslint가 담당하고,
// Next 전용 규칙(no-img-element 등)은 포기하는 대신 어디서 돌려도 동일한 lint를 얻는다.

// FSD 계층, 상위 → 하위. 한 계층은 자기보다 아래 계층만 import할 수 있다(boundaries가 강제).
// Next 트랙에서는 화면 레이어가 `pages`가 아니라 `pageViews`다 — Next가 `src/pages`를
// Pages Router로 예약하고 있어 빌드가 깨진다(rules/next/project-structure).
const FSD_LAYERS = ['app', 'pageViews', 'widgets', 'features', 'entities', 'shared'] as const

export default defineConfig(
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/coverage/**',
    '**/storybook-static/**',
    '**/playwright-report/**',
    '**/test-results/**',
    'next-env.d.ts', // Next가 생성 — 수정/린트 금지
    'src/shared/api/schema.d.ts', // gen-api-types 스킬이 생성
  ]),

  // TypeScript recommended (flat, 타입체크 없는 빠른 구성 — 타입 안전은 tsc가 담당).
  ...tseslint.configs.recommended,

  // ---- import 위생 (eslint-plugin-import-x) ----
  {
    name: 'app/import-x',
    plugins: { 'import-x': pluginImportX },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-cycle': ['error', { maxDepth: 3 }],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
    },
  },

  // ---- FSD 계층 경계 (eslint-plugin-boundaries) ----
  // `src/` 아래 FSD 소스에만 적용. Next `app/` 라우팅 디렉토리는 예외(슬라이스를 조립만
  // 하는 얇은 진입점).
  {
    name: 'app/fsd-boundaries',
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries: pluginBoundaries },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': FSD_LAYERS.map((type) => ({
        type,
        pattern: `src/${type}/**`,
      })),
      'import/resolver': { typescript: true },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: FSD_LAYERS.map((from, i) => ({
            from: { type: from },
            allow: { to: { type: FSD_LAYERS.slice(i) } },
          })),
        },
      ],
    },
  },

  // 테스트·스토리 파일: 해당 없는 규칙 완화.
  {
    name: 'app/test-overrides',
    files: ['**/*.spec.{ts,tsx}', '**/*.stories.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
    rules: {
      'boundaries/dependencies': 'off',
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
