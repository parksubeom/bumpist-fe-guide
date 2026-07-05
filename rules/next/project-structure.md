# Next (App Router) — 구조 (FSD 적응형)

> **쉽게 말하면:** Next의 `app/` 은 "URL 배선"만, 실제 코드는 FSD 레이어(`src/`)에. 이름 충돌 둘(`app`, `pages`)을 이렇게 푼다.

공통 FSD 규칙(계층·경계·슬라이스·관심사 분리)은 `rules/20-project-structure`와 동일하다. Next는 `app/`
디렉토리가 라우팅을 강제하므로 **아래 적응 규칙**을 얹는다.

## 핵심: `app/` 은 라우팅 진입점일 뿐

- Next `app/` (또는 `src/app/`)에는 **라우팅 특수 파일만**(`page`·`layout`·`loading`·`error`…).
- 이 파일들은 **얇게** — FSD 슬라이스에서 화면을 import해 **조립만** 한다. 비즈니스 로직·상태·데이터
  페칭을 `page.tsx`에 직접 쓰지 않는다.

```tsx
// app/users/page.tsx  — 얇은 진입점
import { UserListPage } from '@/pageViews/user-list'
export default function Page() {
  return <UserListPage />
}
```

## 이름 충돌 해소 ① — FSD `pages` 레이어는 `pageViews`로

**Next는 `src/pages/`(와 루트 `pages/`)를 Pages Router 디렉토리로 예약한다.** App Router를 쓰더라도
`src/pages/`가 존재하면 Next가 그 안의 파일을 라우트로 취급해 **빌드가 알 수 없는 타입 에러로 깨진다**
(FSD 슬라이스의 `index.ts` barrel은 페이지 컴포넌트가 아니므로). 실전에서 검증된 규칙:

- **Next 트랙에서는 FSD 화면 레이어 이름을 `pageViews`로 쓴다.** (`src/pageViews/<slice>/`)
- 계층 서열은 동일: `app → pageViews → widgets → features → entities → shared`.
  eslint boundaries 설정(`templates/app-next/eslint.config.ts`)도 `pageViews`로 배선돼 있다.
- Vue·React(Vite) 트랙은 충돌이 없으므로 `pages` 그대로 쓴다 — 이 개명은 **Next 전용**이다.

## 이름 충돌 해소 ② — FSD `app` 레이어와 `src/app` 함정

FSD의 최상위 `app` 레이어(프로바이더·전역 스타일)가 Next `app/` 라우팅 디렉토리와 이름이 겹친다.
여기에 함정이 하나 더 있다: **루트 `app/`과 `src/app/`이 공존하면 Next의 라우팅 디렉토리 판정이
꼬여 빌드가 깨진다.** 규칙:

- **라우팅 디렉토리는 하나만.** `create-next-app`을 `--src-dir`로 만들었으면 전부 `src/app/`,
  아니면 전부 루트 `app/`. 반대편에 `app/` 폴더를 만들지 않는다.
- FSD `app` 레이어의 책임(프로바이더·전역 스타일)은 **라우팅 디렉토리 안에** 둔다:
  `app/layout.tsx` + `app/providers.tsx` (또는 `src/app/layout.tsx` + `src/app/providers.tsx`).
  별도 `app` 레이어 폴더를 라우팅과 나란히 만들지 않는다.

```
app/                      # Next 라우팅 (얇음) — 루트 app/ 변형 기준
  layout.tsx              # root: ./providers 사용
  providers.tsx           # QueryClient·theme 등 클라 프로바이더 ('use client')
  users/page.tsx          # → src/pageViews/user-list 조립
src/
  pageViews/user-list/    # 화면 알맹이 (FSD, Next에선 pages 대신 pageViews)
  widgets/ features/ entities/ shared/
```

## 경계는 그대로 강제

- import 방향(상위→하위만)·public API(`index.ts`) 규칙 유지. `page.tsx`는 슬라이스의 `index.ts`만 import.
- 서버/클라 경계는 구조와 별개 축이다 — `'use client'`는 잎에서만(`rules/next/code-style`).
  서버 전용 모듈(secret 키 클라이언트 등)은 `import 'server-only'`로 가드하고, 클라 안전한 것만
  barrel에서 export한다(서버 함수는 deep import).
