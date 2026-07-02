# React — 상태와 데이터

> **쉽게 말하면:** 화면이 기억하는 값은 Zustand, 서버에서 온 값은 React Query. 둘을 섞지 않는다.

## 클라이언트 상태 — Zustand

```ts
export const useXStore = create<XState>((set, get) => ({
  items: [],
  add: (i) => set((s) => ({ items: [...s.items, i] })),
}))
```

- 컴포넌트에서는 **selector로 필요한 값만 구독**: `const items = useXStore((s) => s.items)`.
- **서버 데이터를 Zustand에 캐싱하지 않는다** — 그건 React Query의 몫.
- 스토어는 슬라이스 `model/` 세그먼트에.

## 서버 상태 — TanStack React Query

- `@tanstack/react-query`의 `useQuery`/`useMutation`. `apiClient.GET('/path')` → `{ data, error }`
  구조분해, 실패 시 `throw error`.
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

- 훅은 슬라이스 `api/` 세그먼트에 두고 `index.ts`로 export. `QueryClientProvider`는 `app`에서 1회 등록.
