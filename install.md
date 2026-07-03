# 설치 — 다른 프로젝트에서 이 가이드 적용하기 (복사)

이 허브를 잠깐 받아 **AI가 쓰는 문서만 각 프로젝트에 복사**한다(서브모듈 X). 복사본이라 git을 몰라도 되고,
서브모듈·윈도우 심볼릭 링크 함정이 없다. 허브 갱신은 자동 반영되지 않으므로, 최신화는 "다시 복사"로 한다(4번).

## 1. 허브 받기 (임시)

소비 프로젝트 루트에서:

```
git clone --depth 1 --branch v0.1.0 https://github.com/parksubeom/bumpist-fe-guide.git .bumpist
```

`--branch v0.1.0`으로 버전을 고정한다(생략하면 최신). `degit`도 가능:
`npx degit parksubeom/bumpist-fe-guide#v0.1.0 .bumpist`. 경로(`.bumpist`)는 복사 후 지울 임시 폴더다.

## 2. 복사 (스킬 + 규칙 + 템플릿)

허브에 포함된 헬퍼를 프로젝트 루트에서 실행한다. 첫 인자로 **프레임워크(`vue`/`react`)**, 둘째로 허브 경로:

```
sh .bumpist/apply-to-project.sh vue .bumpist      # Vue
sh .bumpist/apply-to-project.sh react .bumpist    # React
```

`degit`로 받았으면(태그 정보가 없으므로) 셋째 인자로 버전을 준다: `sh .bumpist/apply-to-project.sh vue .bumpist v0.1.0`.

스크립트가 하는 일(모두 **복사**, 링크 아님):

- 스킬 → `.claude/skills/` (Claude Code는 `.claude/skills/`만 읽음. `setup-fe-project`는 부트스트랩 전용이라 제외).
- 규칙 → `.claude/rules/` — **공통(`rules/*.md`) + 선택 프레임워크(`rules/<vue|react>/*.md`)**.
- 템플릿 → `docs/ai/`.
- 받은 버전을 `.claude/.guide-version`에 기록.
- 루트 `CLAUDE.md`에 붙여넣을 **규칙 @import 블록**을 출력(복사된 위치 기준). 예:
  ```markdown
  @.claude/rules/00-core.md
  … (공통 rules/\*.md 전부)
  @.claude/rules/vue/code-style.md
  … (rules/vue/\*.md 전부)
  ```
  이 줄들을 프로젝트 `CLAUDE.md`에 추가하면 규칙이 로드된다.

## 3. 임시 폴더 삭제 + 확인

```
rm -rf .bumpist
ls .claude/skills/     # 스킬 목록이 보이면 정상
```

최종 프로젝트엔 임시 clone(`.bumpist`)이 남지 않고, 복사된 `.claude/skills`·`.claude/rules`·`docs/ai`와
`.claude/.guide-version`만 있다. Claude Code 세션에서 스킬(`create-component` 등)이 인식되는지 확인한다.

## 4. 갱신 (다시 복사)

허브가 바뀌면 1~3번을 **원하는 버전으로 다시 실행**한다 — 헬퍼가 복사본을 덮어쓴다.
규칙이 늘거나 줄면 출력된 @import 블록으로 `CLAUDE.md`도 갱신한다.
(**자동 최신화는 안 된다** — 이 재복사가 갱신 방법이다.)

## 5. 새 프로젝트 부트스트랩(권장)

빈 프로젝트라면 Claude Code에서 **"새 프로젝트 셋업해줘"** → `setup-fe-project` 스킬이 위 복사 +
pnpm+Turborepo 모노레포·품질 게이트·테스트 툴링까지 한 번에 세우고 검증한다. 마지막 검증:

```
pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build
```

## 버전 관리 (git 태그)

허브는 릴리스마다 **git 태그**(`v1.2.0`)로 버전을 매긴다. 복사 방식이라 받는 순간 그 버전이 프로젝트에
고정된다(다시 복사하기 전엔 안 바뀜). 프로젝트마다 다른 버전을 써도 서로 독립이다.

- **특정 버전으로 받기** — 1번 clone에 `--branch <태그>`(degit이면 `#태그`). 생략하면 최신.
- **채택 버전 기록** — 복사 시 `.claude/.guide-version`에 기록된다("이 프로젝트는 어느 표준 버전인지"가 남음). 이 파일도 커밋.
- **버전 올리기/내리기** — 원하는 태그로 1~3번을 다시 실행한다.
- **옛 버전 패치** — 특정 옛 계열만 고쳐야 하면 허브에서 그 태그로 유지보수 브랜치를 파생해 패치 태그(예: `v0.1.1`)를 낸다.

버전 번호 의미(MAJOR/MINOR/PATCH)와 기여 정책(무엇을 허브에 올리나)은
[README](./README.md#버전-관리-git-태그) 참고.

## 참고

- **팀원 clone**: 복사본이라 그냥 `git clone <프로젝트>` 면 된다(서브모듈 초기화·심볼릭 링크 없음).
- 원본 수정은 **항상 허브에서** 하고 각 프로젝트로 다시 복사한다(프로젝트의 복사본을 직접 고치면 다음
  복사 때 덮어써진다). 단, 그 프로젝트 전용 프롬프트·스킬은 프로젝트 `.claude/`에 두고 허브엔 올리지 않는다.
