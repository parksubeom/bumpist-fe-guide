# Config 템플릿 매니페스트

부트스트랩 시 아래 파일을 지정 위치에 복사한다. 값은 프로젝트명/앱명만 치환하고 나머지는 그대로 둔다.
실물은 이 스킬의 `templates/`에 있다 — `templates/root/`(저장소 루트용, 프레임워크 무관)와
프레임워크별 앱 템플릿 **`templates/app/`(Vue) · `templates/app-react/`(React) · `templates/app-next/`(Next.js)**.
각 앱 템플릿의 `INSTALL.md`에 복사 파일 목록과 전제 devDependencies가 있다.
(`gitignore`는 `.gitignore`로 이름을 바꿔 둔다.)

## 저장소 루트
| 파일 | 요지 |
| --- | --- |
| `pnpm-workspace.yaml` | `packages: [apps/*, packages/*]` |
| `turbo.json` | build/type-check/lint/test/test:e2e/dev 태스크 + 캐싱 |
| `package.json` (private) | turbo 스크립트 + 전역 devDeps(husky/commitlint/cz-git/prettier/lint-staged/size-limit/turbo) |
| `tsconfig.base.json` | 공통 strict 옵션 (앱이 extends) |
| `.npmrc` | `engine-strict=true`, `shamefully-hoist=false` |
| `.gitignore` | node_modules, dist, .turbo, coverage, storybook-static, playwright-report, test-results |
| `.oxlintrc.json` | plugins + `correctness: error` |
| `.prettierrc.json` | semi:false, singleQuote, printWidth 100, tailwind 플러그인 |
| `.prettierignore` | 빌드 산출물 + 락파일 + `**/shared/api/schema.d.ts` |
| `.lintstagedrc.json` | ts/vue: oxlint→eslint→prettier |
| `commitlint.config.ts` | config-conventional + type-enum + cz-git prompt |
| `.size-limit.json` | `apps/*/dist/assets/index-*.js` 100kB, css 15kB |
| `.husky/pre-commit` | `npx lint-staged` |
| `.husky/commit-msg` | `npx --no-install commitlint --edit "$1"` |
| `.husky/pre-push` | `npm run type-check` (타입 오류 push 차단) |

## 각 앱 — Vue (`templates/app/`)
| 파일 | 요지 |
| --- | --- |
| `eslint.config.ts` | Vue + TS + import-x 위생 + FSD boundaries(6계층) + oxlint + prettier-skip |
| `tsconfig.app.json` | `@vue/tsconfig/dom` + `../../tsconfig.base.json` extends, `@/*`→`./src/*` |
| `tsconfig.node.json` | 툴링 config용 (node24, bundler) |
| `tsconfig.json` | app/node 프로젝트 레퍼런스 |
| `vite.config.ts` | vue + tailwind + `@/` alias (+ ANALYZE 트리맵) |
| `vitest.config.ts` | vite mergeConfig, happy-dom, `e2e/**` 제외, v8 커버리지 |
| `playwright.config.ts` | `e2e/`(:4173), build+preview 웹서버, chromium |

## 각 앱 — React (`templates/app-react/`)
Vue와 같은 골격, 프레임워크 플러그인만 다르다.
| 파일 | Vue와의 차이 |
| --- | --- |
| `eslint.config.ts` | vue 플러그인 → `eslint-plugin-react` + `react-hooks`, `.vue` 제거 |
| `vite.config.ts` | `@vitejs/plugin-vue`+devtools → `@vitejs/plugin-react` |
| `vitest.config.ts` | `.tsx` 커버리지, `vitest.setup.ts`(jest-dom) 추가, `main.tsx` 제외 |
| `vitest.setup.ts` | `@testing-library/jest-dom` 등록 + RTL cleanup (신규) |
| `tsconfig.app.json` | `@vue/tsconfig` 대신 bundler 모드 인라인 + `jsx: react-jsx` |
| `tsconfig.node.json` / `tsconfig.json` / `playwright.config.ts` | Vue와 동일(+ setup 포함) |
| `env.d.ts` | `vite/client` 타입 |

## 각 앱 — Next.js (App Router, `templates/app-next/`)
App Router가 라우팅·빌드를 강제하므로 Vite 파일 대신 Next 구조를 쓴다 (`rules/next/*`).
| 파일 | 요지 |
| --- | --- |
| `eslint.config.ts` | `eslint-config-next`(FlatCompat) + import-x + FSD boundaries(`src/`만) + oxlint |
| `tsconfig.json` | Next 표준(single, `plugins:[next]`, `jsx:preserve`) + strict 안전망, `@/*`→`./src/*` |
| `next.config.ts` | next-intl 플러그인 배선 |
| `middleware.ts` | next-intl 로케일 협상/라우팅 |
| `src/app/layout.tsx` | root 레이아웃(얇음) — `<html lang>` + 서버 메시지 + `Providers` |
| `src/app/providers.tsx` | 클라 프로바이더(`'use client'`) — QueryClient + NextIntl |
| `src/app/globals.css` | Tailwind v4 진입점 |
| `src/shared/api/query-client.ts` | 서버/클라 공용 QueryClient 팩토리 |
| `src/shared/config/i18n/*` | `routing`·`request`·`navigation` |
| `locales/{ko,en}/common.json` | 메시지(파일명=네임스페이스), `ko` SSOT |
| `vitest.config.ts` + `vitest.setup.ts` | happy-dom + jest-dom, `vite-tsconfig-paths`로 alias |
| `playwright.config.ts` | `e2e/`(:3000), `next build && next start`, chromium |

> 이 매니페스트는 규칙(`rules/`)과 1:1로 대응한다. config가 규칙과 어긋나면 규칙을 기준으로 맞춘다.
> Vue만 실물 전체가 검증됐고, React·Next 템플릿은 표준 구성으로 새로 번들했다 — 앱 생성기
> (`create-vite`/`create-next-app`) 기본과 병합해 쓰며, 버전은 각 `INSTALL.md`를 따른다.
