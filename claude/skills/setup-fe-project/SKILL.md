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

0. **프레임워크부터 묻는다** — "이 프로젝트는 **Vue**인가요, **React**인가요?" 답에 따라 스택이
   갈린다(`rules/00-core`의 프레임워크별 표): Vue = Vue Router·Pinia·Vue Query·vue-i18n·`@vue/test-utils`,
   React = React Router·Zustand·React Query·react-i18next·React Testing Library. 이후 규칙은
   `rules/vue/*` 또는 `rules/react/*`를 함께 적용한다.
1. **사전 확인** — `pnpm -v`(없으면 `corepack enable pnpm`), `node -v`(`^20.19 || >=22.12`),
   대상 디렉토리가 비어있고 git repo인지.
2. **모노레포 골격** — `templates/root/`를 루트에 복사(프레임워크 무관). 디렉토리:
   `apps/{admin,service}`, `packages/{ui,config}`. `package.json`의 `WORKSPACE_NAME` 치환.
3. **품질 게이트(루트)** — `.oxlintrc.json`·`.prettierrc.json`·`.lintstagedrc.json`·
   `commitlint.config.ts`·`.size-limit.json` + `husky/`의 세 훅(pre-commit·commit-msg·pre-push).
   `pnpm install` 시 `prepare`가 husky를 초기화. `chmod +x .husky/*`. (`rules/50`)
4. **FSD + 앱별 설정** — 각 앱에 `src/{app,pages,widgets,features,entities,shared}` 생성 후
   `templates/app/`(Vue) 복사. eslint FSD boundaries는 프레임워크 무관, vite/vitest는 프레임워크
   플러그인만 다름(Vue plugin vs React plugin).
5. **Storybook** — Vue: `--type vue3`, React: `--type react`.
6. **레퍼런스 컴포넌트/슬라이스** — `create-component`(프레임워크에 맞는 BaseButton),
   `create-slice`로 최소 골격.
7. **검증** — `pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build`
   - 커밋 1회로 husky 동작 확인.

> **참고:** `templates/`의 앱 설정 실물은 현재 **Vue 기준**이다. React 앱 설정 템플릿(vite react
> plugin, tsconfig, RTL setup 등)은 아직 번들되지 않았으니, React 선택 시 `rules/react/*`를 따르되
> 앱 설정은 커뮤니티 표준(`@vitejs/plugin-react` 등)으로 맞춘다. (React 템플릿 번들은 후속 작업)

## 원칙

- 설정은 손으로 새로 쓰지 말고 `templates/` 파일을 복사 후 이름만 치환. 이것이 "동일 품질"의 핵심.
- 전역 도구는 루트, 앱별 도구는 앱 안 (`rules/20-project-structure.md`).
