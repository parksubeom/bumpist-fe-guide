# React 앱 설정 템플릿 (app-react/)

`create-vite`(react-ts) 위에 이 폴더의 파일을 복사해 팀 표준(FSD 경계·품질 게이트·테스트)을 얹는다.
설정 파일은 손으로 쓰지 말고 이 실물을 복사한 뒤 프로젝트명만 맞춘다(`rules/10-guardrails`).

## 복사하는 파일

| 파일                 | 역할                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `eslint.config.ts`   | React + hooks + import-x 위생 + FSD boundaries(6계층) + oxlint + prettier-skip |
| `vite.config.ts`     | `@vitejs/plugin-react` + tailwind + `@/` alias (+ ANALYZE 트리맵)   |
| `vitest.config.ts`   | vite mergeConfig, happy-dom, `e2e/**` 제외, v8 커버리지, jest-dom setup |
| `vitest.setup.ts`    | `@testing-library/jest-dom` 매처 등록 + 테스트 간 cleanup           |
| `tsconfig.json`      | app/node 프로젝트 레퍼런스                                          |
| `tsconfig.app.json`  | bundler 모드 + `jsx: react-jsx` + strict 안전망, `@/*`→`./src/*`     |
| `tsconfig.node.json` | 툴링 config용 (node24, bundler)                                     |
| `playwright.config.ts` | `e2e/`, build+preview 웹서버, chromium                            |
| `env.d.ts`           | `vite/client` 타입                                                  |

## 이 config가 전제하는 devDependencies

```sh
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-import-x eslint-plugin-boundaries eslint-import-resolver-typescript \
  eslint-config-prettier eslint-plugin-oxlint oxlint prettier prettier-plugin-tailwindcss \
  vite @vitejs/plugin-react @tailwindcss/vite tailwindcss rollup-plugin-visualizer \
  vitest @vitest/coverage-v8 happy-dom @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event @playwright/test @tsconfig/node24 @types/node
```

런타임: `pnpm add react react-dom react-router-dom zustand @tanstack/react-query react-i18next i18next \
  class-variance-authority clsx tailwind-merge openapi-fetch` (필요 시 `openapi-typescript`는 -D).

> 앱 `package.json`은 turbo가 위임하는 스크립트를 제공해야 한다:
> `dev`(vite) · `build`(`tsc -b && vite build`) · `preview`(vite preview) · `type-check`(`tsc -b`) ·
> `lint`(eslint) · `test`(vitest run) · `test:e2e`(playwright test). (`rules/00-core` 명령어 표)
