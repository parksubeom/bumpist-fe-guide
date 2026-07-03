# 설치 — 다른 프로젝트에서 이 가이드 적용하기 (npx)

**명령 한 줄**로 규칙·스킬을 프로젝트의 `.claude/`에 복사하고 `CLAUDE.md`까지 배선한다. 복사본이라
git·서브모듈 지식이 필요 없고, 이 허브에 종속되지 않는다. 최신화는 "다시 실행".

## 1. 설치 (npx 한 줄)

소비 프로젝트 루트에서:

```
npx bumpist-code@latest init vue      # vue | react | next (생략하면 package.json에서 자동 감지)
```

버전 고정: `npx bumpist-code@0.1.0 init vue` (생략하면 `@latest`).

## 2. 하는 일

- 스킬 → `.claude/skills/` (Claude Code는 `.claude/skills/`만 읽음. `setup-fe-project`는 부트스트랩 전용이라 제외).
- 규칙 → `.claude/rules/` — 공통(`rules/*.md`) + 선택 프레임워크(`rules/<vue|react>/*.md`).
- 템플릿 → `docs/ai/`.
- 받은 버전 → `.claude/.guide-version` 기록.
- `CLAUDE.md` — 없으면 @import 블록과 함께 생성, 있으면 추가할 줄만 출력. 예:
  ```markdown
  @.claude/rules/00-core.md
  … (공통 rules/\*.md 전부)
  @.claude/rules/vue/code-style.md
  … (rules/vue/\*.md 전부)
  ```

## 3. 확인 + 커밋

```
ls .claude/skills/     # 스킬 목록이 보이면 정상
git add .claude docs/ai CLAUDE.md && git commit -m "chore: adopt bumpist-code guide"
```

Claude Code 세션에서 스킬(`create-component` 등)이 인식되는지 확인한다.

## 4. 갱신 (다시 실행)

허브가 새 버전을 내면 `npx bumpist-code@latest init vue` 를 다시 실행 — `.claude/{skills,rules}`·`docs/ai`를
덮어쓴다. (**자동 최신화는 안 된다** — 재실행이 갱신 방법이다.)

## 5. 새 프로젝트 부트스트랩(권장)

빈 프로젝트라면 1번 후 Claude Code에서 **"새 프로젝트 셋업해줘"** → `setup-fe-project` 스킬이
pnpm+Turborepo 모노레포·품질 게이트·테스트 툴링까지 세우고 검증한다:

```
pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build
```

## 버전 관리 (semver)

npm에 semver(git 태그와 동일: `0.1.0`)로 배포한다. 받는 순간 그 버전이 프로젝트에 고정된다(다시 실행하기
전엔 안 바뀜). 프로젝트마다 다른 버전을 써도 서로 독립이다.

- **특정 버전** — `npx bumpist-code@<버전> init <fw>` (생략하면 `@latest`).
- **채택 버전 기록** — `.claude/.guide-version`에 남는다. 이 파일도 함께 커밋.
- **올리기/내리기** — 원하는 버전으로 다시 실행한다.
- **옛 버전 패치** — 특정 옛 계열만 고쳐야 하면 그 태그로 유지보수 브랜치를 파생해 패치 버전(예: `0.1.1`)을 배포한다.

버전 번호 의미(MAJOR/MINOR/PATCH)와 기여 정책(무엇을 허브에 올리나)은
[README](./README.md#버전-관리-semver) 참고.

## npm 없이 (대안)

npm/npx를 못 쓰는 환경이면 degit(또는 clone)으로 직접 복사한다:

```
npx degit parksubeom/bumpist-fe-guide#v0.1.0 .bumpist
sh .bumpist/apply-to-project.sh vue .bumpist v0.1.0
rm -rf .bumpist
```

## 참고

- **팀원**: 복사본이 프로젝트에 커밋돼 있으니 그냥 `git clone <프로젝트>` 면 된다.
- 원본 수정은 **항상 허브에서** 하고 새 버전으로 다시 배포한다. 단, 그 프로젝트 전용 프롬프트·스킬은
  프로젝트 `.claude/`에 두고 허브엔 올리지 않는다.
