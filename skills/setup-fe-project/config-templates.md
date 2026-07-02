# Config 템플릿 매니페스트

부트스트랩 시 아래 파일을 지정 위치에 복사한다. 값은 프로젝트명/앱명만 치환하고 나머지는 그대로 둔다.
실물은 이 스킬의 `templates/`에 있다 — `templates/root/`(저장소 루트용), `templates/app/`(앱별).
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

## 각 앱 (`apps/admin`, `apps/service`)
| 파일 | 요지 |
| --- | --- |
| `eslint.config.ts` | Vue + TS + import-x 위생 + FSD boundaries(6계층) + oxlint + prettier-skip |
| `tsconfig.app.json` | `@vue/tsconfig/dom` + `../../tsconfig.base.json` extends, `@/*`→`./src/*` |
| `tsconfig.node.json` | 툴링 config용 (node24, bundler) |
| `tsconfig.json` | app/node 프로젝트 레퍼런스 |
| `vite.config.ts` | vue + tailwind + `@/` alias (+ ANALYZE 트리맵) |
| `vitest.config.ts` | vite mergeConfig, happy-dom, `e2e/**` 제외, v8 커버리지 |
| `playwright.config.ts` | `e2e/`, build+preview 웹서버, chromium |

> 이 매니페스트는 규칙(`rules/`)과 1:1로 대응한다. config가 규칙과 어긋나면 규칙을 기준으로 맞춘다.
