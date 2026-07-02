# React — 코드 스타일

> **쉽게 말하면:** 화면 부품(컴포넌트)을 만드는 통일된 방법(React).

## 컴포넌트 기본

- **함수 컴포넌트 + 훅**만 사용. 클래스 컴포넌트 금지. 파일당 하나, `PascalCase.tsx`.
- 슬라이스 `index.ts`로 노출.

## Props

- **Props는 `interface Props`로 정의**(인라인 지양). 구조분해 + 기본값.

```tsx
interface Props {
  variant?: ButtonVariants['variant']
  disabled?: boolean
  className?: string // cn으로 병합되는 외부 클래스
}
export function Button({ variant = 'primary', disabled = false, className }: Props) { … }
```

- 이벤트는 `onXxx` 콜백 prop으로. 핸들러 타입 명시(`(e: MouseEvent) => void`).

## Variant 컴포넌트 (cva + cn)

- variant는 **`cva`로 클래스 정의**, `VariantProps<typeof xVariants>`에서 타입 파생.
- 외부 `className`은 **`cn`(`@/shared/lib`, clsx + tailwind-merge)으로 병합**.

## 스타일

- **Tailwind 유틸리티 클래스만.** 컴포넌트 `<style>` 없음. 다크모드 `dark:`.
- 색·간격·타이포는 **디자인 토큰 유틸**(`bg-*`, `p-*`, `text-*`) 사용, 하드코딩 금지(`gen-tokens`).

## 상태·데이터·문구

- 상태/데이터는 `react/state-and-data`(Zustand + React Query). 화면 문구는 `react/i18n`의 `t()`.
- 부수효과 없는 순수 계산은 컴포넌트·훅에 두지 말고 `lib` 세그먼트로 분리
  (`rules/20` "관심사 분리 판단 기준" 질문 1).

## TypeScript

- strict 공통 옵션(`rules/00-core`). `any` 회피, 좁은 타입 우선. 훅 반환·props 타입 명시.
