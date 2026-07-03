---
name: setup-fe-project
description: 팀 표준 프론트엔드 모노레포(admin + service)를 pnpm workspace + Turborepo로 처음부터 구성한다. FSD + 품질 게이트 + 테스트 툴링까지. 새 프로젝트를 시작하거나 "프로젝트 셋업/보일러플레이트" 요청 시 사용.
---

# 새 프로젝트 부트스트랩

`rules/20-project-structure.md`의 모노레포·FSD 구조를 세운다. 설정 파일은 **직접 작성하지 않고**
`templates/`의 실물을 **그대로 복사**한다 (임의 작성 금지 — `rules/10-guardrails.md`). 어떤 파일을
어디에 두는지는 [`config-templates.md`](./config-templates.md) 참조.

- `templates/root/` → 저장소 루트에 복사 (`gitignore`는 `.gitignore`로 이름 변경)
- `templates/app/` → 각 앱(`apps/admin`, `apps/service`)에 복사

## 순서

0. **프레임워크부터 묻는다** — "이 프로젝트는 **Vue**·**React**·**Next.js** 중 무엇인가요?" 답에 따라
   스택이 갈린다(`rules/00-core`의 프레임워크별 표): Vue = Vue Router·Pinia·Vue Query·vue-i18n·`@vue/test-utils`,
   React = React Router·Zustand·React Query·react-i18next·React Testing Library, Next.js(App Router) =
   App Router·RSC fetch + Server Action·Zustand·React Query·next-intl·React Testing Library. 이후 규칙은
   `rules/vue/*`·`rules/react/*`·`rules/next/*`를 함께 적용한다.
   **Next.js를 고르면 아래 1~7 대신 "Next.js 부트스트랩" 절을 따른다** (App Router는 Vite 모노레포
   골격과 부트스트랩이 다르다).
1. **사전 확인** — `pnpm -v`(없으면 `corepack enable pnpm`), `node -v`(`^20.19 || >=22.12`),
   대상 디렉토리가 비어있고 git repo인지.
2. **모노레포 골격** — `templates/root/`를 루트에 복사(프레임워크 무관). 디렉토리:
   `apps/{admin,service}`, `packages/{ui,config}`. `package.json`의 `WORKSPACE_NAME` 치환.
3. **품질 게이트(루트)** — `.oxlintrc.json`·`.prettierrc.json`·`.lintstagedrc.json`·
   `commitlint.config.ts`·`.size-limit.json` + `husky/`의 세 훅(pre-commit·commit-msg·pre-push).
   `pnpm install` 시 `prepare`가 husky를 초기화. `chmod +x .husky/*`. (`rules/50`)
4. **FSD + 앱별 설정** — 각 앱에 `src/{app,pages,widgets,features,entities,shared}` 생성 후
   프레임워크별 앱 템플릿을 복사: **Vue → `templates/app/`**, **React → `templates/app-react/`**.
   각 템플릿의 `INSTALL.md`에 복사 파일 목록과 전제 devDependencies가 있다. eslint FSD boundaries는
   프레임워크 무관, vite/vitest는 프레임워크 플러그인만 다르다.
5. **Storybook** — Vue: `--type vue3`, React: `--type react`.
6. **레퍼런스 컴포넌트/슬라이스** — `create-component`(프레임워크에 맞는 BaseButton),
   `create-slice`로 최소 골격.
7. **검증** — `pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build`
   - 커밋 1회로 husky 동작 확인.

> **참고:** 앱 설정 실물은 세 트랙 모두 번들돼 있다 — `templates/app/`(Vue) · `templates/app-react/`(React) ·
> `templates/app-next/`(Next.js). Vue는 실전 검증됐고 React·Next는 표준 구성으로 새로 번들했으니,
> 앱 생성기 기본과 병합해 쓰며 패키지 버전은 각 `INSTALL.md`를 따른다.

## Next.js 부트스트랩 (App Router)

Next.js(App Router)는 Vite 모노레포 템플릿을 쓰지 않는다. **App Router가 라우팅·빌드를 강제**하므로
`create-next-app`으로 앱을 세운 뒤 **FSD 레이어를 `src/`로 재조정**한다(`rules/next/project-structure`).
앱 설정·프로바이더·i18n 실물은 **`templates/app-next/`**에 있다(`INSTALL.md` 참조) — 아래 절차대로
복사해 쓰고 `rules/next/*`를 SSoT로 따른다.

0. **사전 확인** — `node -v`(`^20.19 || >=22.12`), `pnpm -v`(없으면 `corepack enable pnpm`),
   대상 디렉토리가 비어 있고 git repo인지.
1. **앱 생성** — `pnpm create next-app@latest` — **App Router · TypeScript · Tailwind CSS · ESLint · `src/` 디렉토리** 옵션 선택.
   (모노레포로 갈 거면 `apps/web`에 생성하고 루트에 `pnpm-workspace.yaml`·`turbo.json`을 얹는다 —
   `templates/root/`의 루트 게이트는 프레임워크 무관이라 그대로 복사·재사용 가능.)
2. **공통 스택 설치** — `templates/app-next/INSTALL.md`의 devDependencies·런타임 목록대로 설치
   (`next-intl`·React Query·Zustand·cva/clsx/tailwind-merge·RTL·Playwright 등). Storybook은 `@storybook/nextjs`.
3. **앱 설정 복사** — `templates/app-next/`의 실물을 앱에 복사: `eslint.config.ts`(`eslint-config-next`
   + import-x + FSD boundaries) · `tsconfig.json` · `next.config.ts`(next-intl) · `middleware.ts` ·
   `vitest.config.ts`+`vitest.setup.ts` · `playwright.config.ts`. `type-check`는 `tsc --noEmit`.
4. **FSD × App Router 재조정** (`rules/next/project-structure`, 템플릿에 골격 포함) —
   - `app/`(또는 `src/app/`)에는 **라우팅 특수 파일만**(`layout`·`page`·`loading`·`error`…), 얇게 유지.
   - FSD 레이어(`pages`·`widgets`·`features`·`entities`·`shared`)는 **`src/` 아래**.
   - FSD `app` 레이어(프로바이더·전역 스타일)는 **`src/app/layout.tsx` + `src/app/providers.tsx`**(템플릿 제공).
   - `QueryClientProvider`·`NextIntlClientProvider`·theme은 `providers.tsx`(`'use client'`)에서 등록(템플릿 제공).
5. **i18n·데이터·에러 규약** — next-intl 설정은 템플릿의 `src/shared/config/i18n/*` + `middleware.ts` +
   `locales/{ko,en}/`. 서버 fetch/Server Action 우선, `error.tsx`/`not-found.tsx` 경계는 직접 추가.
   각각 `rules/next/{i18n,state-and-data,error-handling}`.
6. **레퍼런스 컴포넌트/슬라이스** — `create-component`(`templates/BaseButton-react/`)·`create-slice`로 최소 골격.
   `page.tsx`는 슬라이스의 `index.ts`만 import해 조립(`rules/next/routing`).
7. **검증** — `pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build`
   + 커밋 1회로 husky 동작 확인.

> **참고:** `templates/app-next/`는 표준 구성으로 새로 번들한 것이다. `create-next-app` 기본 구조와
> 병합해 쓰며, 패키지 버전은 `INSTALL.md`를 따른다. Vue처럼 실전 반복 검증이 쌓이면 조정될 수 있다.

## 원칙

- 설정은 손으로 새로 쓰지 말고 `templates/` 파일을 복사 후 이름만 치환. 이것이 "동일 품질"의 핵심.
- 전역 도구는 루트, 앱별 도구는 앱 안 (`rules/20-project-structure.md`).
