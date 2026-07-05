# Changelog

이 프로젝트의 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르고,
버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 따른다. **git 태그 = npm 배포 버전**이며,
소비 프로젝트는 `.claude/.guide-version`으로 자기 버전을 확인할 수 있다.

- `MAJOR` — 규칙 삭제·이름/경로 변경 등 깨지는 변경
- `MINOR` — 새 규칙·스킬·템플릿 추가, 규칙 보강
- `PATCH` — 문구·오타·작은 수정

## [Unreleased]

## [0.5.1] - 2026-07-05

Next 트랙 **실전 검증** 릴리스. 실서비스 MVP([re-pin](https://github.com/parksubeom/re-pin))를
이 가이드로 부트스트랩하며 발견한 지뢰 3종을 규칙·템플릿에 반영해, 소비 프로젝트가
첫 빌드부터 깨지지 않게 했다.

### Fixed

- **[설치 자체가 안 됨]** `bin/cli.js`가 `fs.cpSync`/`fs.rmSync`의 `{ recursive: true }`를 썼는데,
  Node 24.x 일부 빌드가 Windows에서 이 재귀 fs 작업 중 네이티브 크래시(STATUS_STACK_BUFFER_OVERRUN)를
  일으켜 `npx bumpist-code init`이 배너만 출력하고 아무것도 복사하지 못한 채 죽었다
  → 의존성 없는 수동 재귀 복사/삭제로 교체(Node 버전 무관 안전). fresh 설치·재실행 모두 검증.
- **[빌드 깨짐]** Next.js가 `src/pages`를 Pages Router로 예약해 FSD의 `pages` 레이어와 충돌
  → Next 트랙에서 화면 레이어를 `pageViews`로 개명. `rules/next/project-structure.md` 재작성,
  `rules/20-project-structure.md`에 예외 크로스레퍼런스, `app-next` ESLint boundaries·SKILL·INSTALL 정합.
  루트 `app/`과 `src/app` 공존 금지(라우팅 디렉토리 단일화) 함정도 문서화.
- **[커밋 훅 깨짐]** `eslint-config-next` + FlatCompat이 ESLint 9 + pnpm 환경에서 lint-staged의
  파일 단위 실행을 깨뜨림 → `app-next`의 `eslint.config`를 `typescript-eslint` flat 네이티브 구성으로 교체.
  INSTALL 의존성 목록·README·config-templates 갱신.
- **[테스트 오수집]** Vitest가 `.claude/` 스킬 템플릿의 spec까지 수집해 실패
  → 3트랙(`app`·`app-react`·`app-next`) 모두 `include`를 `src`로 한정하고 `.claude`를 제외.

### Added

- `app-next` 템플릿에 `postcss.config.mjs` 추가 — `create-next-app`을 `--tailwind` 없이 만든 경우 대비.
- `app-next` INSTALL에 단일 언어(i18n 제외) 변형 안내와 Windows/pnpm 트러블슈팅 절 추가.
- 커뮤니티 인프라 — `CONTRIBUTING.md`, GitHub 이슈 폼 2종(버그 리포트·규칙/스킬 제안)과
  PR 템플릿, 이 `CHANGELOG.md`.
- `README.en.md` — 영어권 독자용 요약 README.
- README — 브랜드 스토리("왜 Bumpist Code인가")·실전 사례(Showcase: re-pin)·기여·도움이 됐다면 섹션.
- `marketing/launch-kit.md` — 커뮤니티 채널별 포스팅 초안(npm 번들 미포함).

### Changed

- 루트 템플릿 `.prettierignore`·`.oxlintrc.json`에 `.claude`·`.next`·`next-env.d.ts` 제외 추가.
- README 적용 절차를 npx 중심으로 명료화 — 전제조건(Node 18+ · Claude Code)·30초 온보딩·실전 검증 명시,
  버전 예시 현행화.
- npm `keywords`를 19개로 최적화 — `claude-skills`·`agent-skills`·`vibe-coding`·`code-quality` 등 추가,
  검색 노이즈(`next`·`rsc`) 제거.

## [0.5.0] - 2026-07-04

Next.js 3트랙 정합화 + React·Next 앱 템플릿 실물 번들. 이제 Vue·React·Next.js 세 트랙 모두
"복사만으로 동작"한다.

### Added

- `skills/setup-fe-project/templates/app-react/` — Vue와 동일 골격의 React 앱 설정 템플릿
  (ESLint react+hooks · Vite react 플러그인 · Vitest+jest-dom setup · tsconfig×3 · Playwright · INSTALL).
- `skills/setup-fe-project/templates/app-next/` — App Router 실물 템플릿
  (tsconfig · `next.config`(next-intl) · middleware · `src/app/{layout,providers,globals}` ·
  `shared/api/query-client` · `shared/config/i18n` · `locales/{ko,en}` · Vitest · Playwright · INSTALL).
- `skills/create-component/templates/BaseButton-react/` — TSX 컴포넌트 + 스펙(RTL) + 스토리 + index
  (React·Next 공용).
- `skills/setup-fe-project/SKILL.md`에 "Next.js 부트스트랩" 절 신설 —
  `create-next-app` → FSD `src/` 재조정, `rules/next/*` 상호참조.

### Changed

- Next.js를 문서·CLI·규칙·스킬 전 계층에 3트랙으로 정합화:
  `apply-to-project.sh`가 `next` 인자 허용, `rules/00-core.md`(SSoT) 프레임워크 표에 Next 열 추가,
  `install.md` 규칙 경로를 `rules/<vue|react|next>`로 정정.
- `config-templates.md` 매니페스트를 3트랙(Vue/React/Next)으로 확장.
- README — 스택·라이브러리 & 툴 표에 Next.js 열 추가, 태그라인·스킬 표를 3트랙 템플릿 반영으로 갱신,
  "미번들/후속 작업" 문구 제거.

## [0.4.2] - 2026-07-03

### Changed

- README 상단 세련화 — 정량 태그라인(Vue·React·Next 3트랙 · 스킬 14 · 자동 감지 · 디자인 기본선)과
  `npx bumpist-code init` Quick start를 최상단에 노출.

## [0.4.1] - 2026-07-03

### Changed

- impeccable 페어링 문구 명확화 — 자동 설치가 아니라 원하면 직접 `npx impeccable install`,
  안 깔아도 디자인 기본선은 그대로 동작함을 명시.

## [0.4.0] - 2026-07-03

### Added

- [impeccable](https://github.com/pbakaus/impeccable) 디자인 스킬 연계(권고·핸드오프) —
  `rules/30-design.md`에 "심화 디자인" 절과 `DESIGN.md`/디자인 토큰 우선순위 선언,
  CLI `init` 출력에 설치 권고 한 줄(자동 설치 아님).
  역할 분담: 구조·품질은 bumpist-code, 디자인 craft는 impeccable.

## [0.3.1] - 2026-07-03

### Changed

- README에 "디자인 지향" 섹션 추가 — 뉴트럴·플랫·브랜드 컬러 1개 원칙을 상단부에 노출
  (`rules/30-design.md` 링크).

## [0.3.0] - 2026-07-03

### Added

- 디자인 원칙 규칙 `rules/30-design.md` — 뉴트럴 베이스 + 브랜드 컬러 1개, 플랫 우선
  (불필요한 그림자 금지), 토큰이 최종 권위, 접근성 우선(WCAG AA), 절제된 모션,
  빈·로딩·에러 상태 완결성, 기본값(색·radius·elevation·간격·타이포).

## [0.2.0] - 2026-07-03

### Added

- **Next.js(App Router) 트랙** — `rules/next/` 6개: `code-style`(서버/클라 경계) ·
  `state-and-data`(RSC fetch + Query + Server Action) · `routing`(App Router 파일 규약) ·
  `project-structure`(FSD × `app/` 재조정) · `i18n`(next-intl) · `error-handling`(`error.tsx` 경계).
- **프레임워크 자동 감지** — `init` 인자를 생략하면 `package.json`에서 vue | react | next를 감지.

## [0.1.0] - 2026-07-03

첫 npm CLI 릴리스. `npx bumpist-code init <vue|react>` 한 줄로 규칙·스킬을 소비 프로젝트의
`.claude/`에 복사하고 `CLAUDE.md`를 배선한다.

### Added

- npm CLI `bumpist-code` (`bin/cli.js`) — 규칙·스킬·`docs/ai` 템플릿 복사,
  `.claude/.guide-version` 기록, `CLAUDE.md` @import 배선.
- 공통 규칙 12개(`rules/00`~`90`) + 프레임워크 트랙 규칙(`rules/vue/`·`rules/react/` 각 4개).
- Claude Code 스킬 14개 — `dev-workflow` · `plan-feature` · `setup-fe-project` · `create-component` ·
  `implement-from-figma` · `create-slice` · `gen-api-types` · `gen-tokens` · `write-test` ·
  `debug-issue` · `create-adr` · `review-changes` · `prepare-commit` · `prepare-pr`.
- Bumpist Code 브랜딩(배너·로고·뱃지), 비개발자 가이드, glossary, degit/clone 대안 경로
  (`apply-to-project.sh`).

### Changed

- 배포 방식을 git submodule → 복사(clone/degit) → **npm CLI**로 전환.

[Unreleased]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/parksubeom/bumpist-fe-guide/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/parksubeom/bumpist-fe-guide/releases/tag/v0.1.0
