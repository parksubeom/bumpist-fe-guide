# Next.js 앱 설정 템플릿 (app-next/, App Router)

`create-next-app`(App Router · TypeScript · Tailwind · ESLint · `src/`) 위에 이 폴더를 복사해
팀 표준(FSD × App Router 재조정 · next-intl · 품질 게이트 · 테스트)을 얹는다. 설정은 손으로 쓰지
말고 이 실물을 복사해 프로젝트명만 맞춘다(`rules/10-guardrails`, `rules/next/*`).

## 복사하는 파일

| 파일                              | 역할                                                                     |
| --------------------------------- | ------------------------------------------------------------------------ |
| `eslint.config.ts`                | typescript-eslint + import-x 위생 + FSD boundaries(`src/`만, **pageViews**) + oxlint + prettier-skip |
| `tsconfig.json`                   | Next 표준(single, `plugins:[next]`) + strict 안전망, `@/*`→`./src/*`      |
| `next.config.ts`                  | next-intl 플러그인 배선(`src/shared/config/i18n/request.ts`)              |
| `middleware.ts`                   | next-intl 로케일 협상 + `/[locale]/...` 라우팅                           |
| `postcss.config.mjs`              | Tailwind v4 PostCSS 플러그인 (`--tailwind` 없이 만든 앱엔 필수)          |
| `src/app/layout.tsx`              | root 레이아웃(얇음) — `<html lang>` + 서버 메시지 로드 + `Providers` 마운트 |
| `src/app/providers.tsx`           | 클라 프로바이더 묶음(`'use client'`) — QueryClient + NextIntl            |
| `src/app/globals.css`             | Tailwind v4 진입점                                                        |
| `src/shared/api/query-client.ts`  | 서버/클라 공용 QueryClient 팩토리(SSR 친화 staleTime)                    |
| `src/shared/config/i18n/*`        | `routing`·`request`(서버 메시지)·`navigation`(Link/router 헬퍼)          |
| `locales/{ko,en}/common.json`     | 메시지(파일명 = 네임스페이스). `ko`가 스키마 SSOT, 폴백 `en`             |
| `vitest.config.ts` + `setup`      | happy-dom + jest-dom, 스펙은 `src/**`만 수집(`.claude/` 제외), 스펙 0개 통과 |
| `playwright.config.ts`            | `e2e/`, `next build && next start`(:3000), chromium                      |

> ⚠️ **FSD 화면 레이어는 Next에서 `pageViews`다** (`src/pageViews/*`) — Next가 `src/pages`를
> Pages Router로 예약하고 있어 그 이름을 쓰면 빌드가 깨진다. 그리고 **라우팅 디렉토리는 하나만**:
> `src/app/` 또는 루트 `app/` 중 하나로 통일하고 반대편에 `app` 폴더를 만들지 않는다.
> 자세한 이유와 예시는 `rules/next/project-structure`. `page.tsx`는 `src/pageViews/*`
> 슬라이스의 `index.ts`만 import해 조립한다.

> **단일 언어 앱이면** next-intl 묶음(`middleware.ts`·`src/shared/config/i18n/*`·`locales/`)을
> 복사하지 않고, `next.config.ts`에서 withNextIntl 래핑을, `layout.tsx`/`providers.tsx`에서
> NextIntl 부분을 걷어낸다. 나중에 다국어가 필요해지면 그때 얹는다.

## 이 config가 전제하는 devDependencies

```sh
pnpm add -D eslint typescript-eslint eslint-plugin-import-x \
  eslint-plugin-boundaries eslint-import-resolver-typescript eslint-config-prettier \
  eslint-plugin-oxlint oxlint prettier prettier-plugin-tailwindcss \
  vitest @vitest/coverage-v8 happy-dom @vitejs/plugin-react vite-tsconfig-paths \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test typescript @types/node
```

> `eslint-config-next`는 **쓰지 않는다** — eslint 9(flat) + pnpm 조합에서 FlatCompat 브리지가
> 파일 단위 실행(lint-staged)을 깨뜨리는 게 실전에서 확인됐다. TS 규칙은 typescript-eslint가 담당.

런타임: `pnpm add next react react-dom zustand @tanstack/react-query next-intl \
  class-variance-authority clsx tailwind-merge openapi-fetch tailwindcss @tailwindcss/postcss`
(서버 fetch/Server Action은 Next 내장, `openapi-typescript`는 -D. 단일 언어면 next-intl 생략.)

> 앱 `package.json`은 turbo가 위임하는 스크립트를 제공해야 한다:
> `dev`(`next dev`) · `build`(`next build`) · `start`(`next start`) · `type-check`(`tsc --noEmit`) ·
> `lint`(`oxlint && eslint .`) · `test`(vitest run) · `test:e2e`(playwright test). (`rules/00-core` 명령어 표)

## Windows/pnpm 트러블슈팅 (실전에서 겪은 것)

- **pnpm이 설치 중 네이티브 크래시(exit -1073740791)** — pnpm 10.2x 일부 버전이 Windows에서
  링크 단계에 죽는 사례가 있다. Volta 사용 시 `volta install pnpm@9.15.4` 처럼 검증된 9.x로
  내려서 재시도. Node는 22 LTS 권장(`volta pin node@22`).
- **`pnpm exec <bin>`만 크래시** — 같은 환경 이슈. 스크립트에서는 `node scripts/<wrapper>.mjs`로
  로컬 바이너리를 직접 호출하는 패턴을 쓴다(`gen-api.mjs` 참고).
