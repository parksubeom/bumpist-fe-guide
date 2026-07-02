# Vue — 상태와 데이터

> **쉽게 말하면:** 화면이 기억하는 값은 Pinia, 서버에서 온 값은 Vue Query. 둘을 섞지 않는다.

## 클라이언트 상태 — Pinia (setup-store)

```ts
export const useXStore = defineStore('x', () => {
  const items = ref<Item[]>([]) // state
  const count = computed(() => items.value.length) // getter
  function add(i: Item) {
    items.value.push(i)
  } // action
  return { items, count, add } // public 표면만 반환
})
```

- **서버 데이터를 Pinia에 캐싱하지 않는다** — 그건 Vue Query의 몫.
- 스토어는 슬라이스 `model/` 세그먼트에.

## 서버 상태 — TanStack Vue Query

- `@tanstack/vue-query`의 `useQuery`/`useMutation`. `apiClient.GET('/path')` → `{ data, error }`
  구조분해, 실패 시 `throw error`, 성공 시 `data`.
- **쿼리 키는 훅과 colocation하고 export**. 타입은 openapi 생성 타입 사용(`rules/40`).

```ts
export const usersQueryKey = ['users'] as const
export function useUsersQuery() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/users')
      if (error) throw error
      return data
    },
  })
}
```

- 훅은 슬라이스 `api/` 세그먼트에 두고 `index.ts`로 export. 컴포넌트에서 `useI18n`으로 문구는 별도(`vue/i18n`).
