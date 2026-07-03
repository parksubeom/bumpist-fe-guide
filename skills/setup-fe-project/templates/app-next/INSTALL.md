# Next.js 앱 설정 템플릿 (app-next/, App Router)

`create-next-app`(App Router · TypeScript · Tailwind · ESLint · `src/`) 위에 이 폴더를 복사해
팀 표준(FSD × App Router 재조정 · next-intl · 품질 게이트 · 테스트)을 얹는다. 설정은 손으로 쓰지
말고 이 실물을 복사해 프로젝트명만 맞춘다(`rules/10-guardrails`, `rules/next/*`).

## 복사하는 파일

| 파일                              | 역할                                                                     |
| --------------------------------- | ------------------------------------------------------------------------ |
| `eslint.config.ts`                | `eslint-config-next` + import-x 위생 + FSD boundaries(`src/`만) + oxlint + prettier-skip |
| `tsconfig.json`                   | Next 표준(single, `plugins:[next]`) + strict 안전망, `@/*`→`./src/*`      |
| `next.config.ts`                  | next-intl 플러그인 배선(`src/shared/config/i18n/request.ts`)              |
| `middleware.ts`                   | next-intl 로케일 협상 + `/[locale]/...` 라우팅                           |
| `src/app/layout.tsx`              | root 레이아웃(얇음) — `<html lang>` + 서버 메시지 로드 + `Providers` 마운트 |
| `src/app/providers.tsx`           | 클라 프로바이더 묶음(`'use client'`) — QueryClient + NextIntl            |
| `src/app/globals.css`             | Tailwind v4 진입점                                                        |
| `src/shared/api/query-client.ts`  | 서버/클라 공용 QueryClient 팩토리(SSR 친화 staleTime)                    |
| `src/shared/config/i18n/*`        | `routing`·`request`(서버 메시지)·`navigation`(Link/router 헬퍼)          |
| `locales/{ko,en}/common.json`     | 메시지(파일명 = 네임스페이스). `ko`가 스키마 SSOT, 폴백 `en`             |
| `vitest.config.ts` + `setup`      | happy-dom + jest-dom, `vite-tsconfig-paths`로 `@/` alias, `e2e/**` 제외  |
| `playwright.config.ts`            | `e2e/`, `next build && next start`(:3000), chromium                      |

> FSD 레이어(`pages`·`widgets`·`features`·`entities`·`shared`)는 `src/` 아래에 두고, `app/`은
> 라우팅 특수 파일만 얇게 유지한다(`rules/next/project-structure`). `page.tsx`는 `src/pages/*`
> 슬라이스의 `index.ts`만 import해 조립한다.

## 이 config가 전제하는 devDependencies

```sh
pnpm add -D eslint @eslint/eslintrc eslint-config-next eslint-plugin-import-x \
  eslint-plugin-boundaries eslint-import-resolver-typescript eslint-config-prettier \
  eslint-plugin-oxlint oxlint prettier prettier-plugin-tailwindcss \
  vitest @vitest/coverage-v8 happy-dom @vitejs/plugin-react vite-tsconfig-paths \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test typescript @types/node
```

런타임: `pnpm add next react react-dom zustand @tanstack/react-query next-intl \
  class-variance-authority clsx tailwind-merge openapi-fetch tailwindcss @tailwindcss/postcss`
(서버 fetch/Server Action은 Next 내장, `openapi-typescript`는 -D).

> 앱 `package.json`은 turbo가 위임하는 스크립트를 제공해야 한다:
> `dev`(`next dev`) · `build`(`next build`) · `start`(`next start`) · `type-check`(`tsc --noEmit`) ·
> `lint`(eslint) · `test`(vitest run) · `test:e2e`(playwright test). (`rules/00-core` 명령어 표)
