# Vue — 코드 스타일 (SFC · 컴포넌트 · TS)

> **쉽게 말하면:** 화면 부품(컴포넌트)을 만드는 통일된 방법(Vue).

## SFC 기본

- `<script setup lang="ts">` + Composition API만 사용. Options API 금지.
- 컴포넌트는 `PascalCase.vue`, 파일당 하나, 슬라이스 `index.ts`로 노출.

## Props / Emits

- **Props는 인라인 금지.** `interface Props` 정의 후 `withDefaults(defineProps<Props>(), { ... })`.
- 이벤트는 `defineEmits<{ eventName: [payload] }>()`로 타이핑.

```ts
interface Props {
  variant?: ButtonVariants['variant']
  disabled?: boolean
  /** cn으로 병합되는 외부 클래스 */
  class?: HTMLAttributes['class']
}
const props = withDefaults(defineProps<Props>(), { variant: 'primary', disabled: false, class: '' })
defineEmits<{ click: [event: MouseEvent] }>()
```

## Variant 컴포넌트 (cva + cn)

- variant가 있으면 **`cva`로 클래스 정의**, `VariantProps<typeof xVariants>`에서 타입 파생.
- 외부 주입 클래스는 `class?: HTMLAttributes['class']`로 받아 **`cn`(`@/shared/lib`)으로 병합** —
  `tailwind-merge`가 충돌 정리. 레퍼런스: `shared/ui/BaseButton`.

## 상태·데이터

- 클라이언트 상태(Pinia) + 서버 상태(Vue Query) 규칙은 `rules/vue/state-and-data.md` 참조.
  서버 데이터는 Pinia에 두지 않는다.
- 부수효과 없는 순수 계산은 컴포넌트·스토어에 두지 말고 `lib` 세그먼트로 분리
  (`rules/20` "관심사 분리 판단 기준" 질문 1).

## TypeScript strict (프로젝트 공통 safety net)

`tsconfig.base.json`에서 강제: `noUncheckedIndexedAccess`, `noImplicitOverride`,
`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
`forceConsistentCasingInFileNames`. `any` 회피, 좁은 타입 우선.

## 스타일

- **Tailwind 유틸리티 클래스만.** 컴포넌트별 `<style>` 블록 금지. (→ `styling`은 이 문서에 통합)
- 다크모드는 `dark:`. 전역 설정은 `app/styles/main.css`. 클래스 순서는 prettier가 정렬.
- **디자인 토큰**: 색상·간격·radius·타이포는 하드코딩 대신 토큰 유틸(`bg-bg-default`, `p-md` 등)을
  쓴다. 토큰은 `gen-tokens` 스킬이 `tokens.css`로 생성(생성 파일, 손대지 않음, `docs/adr/0010`).

## 사용자 문구

- 화면에 보이는 텍스트는 하드코딩하지 말고 `useI18n()`의 `t('...')`로 참조한다(`rules/vue/i18n`).
