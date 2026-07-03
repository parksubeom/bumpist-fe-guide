# 설치 — 다른 프로젝트에서 이 가이드 참조하기

이 허브 저장소를 각 프로젝트에 **복사하지 않고 git submodule로 참조**한다. 한 곳(허브 repo)만
고치고 각 프로젝트에서 `submodule update`하면 규칙·스킬이 함께 갱신된다.

## 1. 허브를 submodule로 추가

소비 프로젝트 루트에서:

```
git submodule add git@github.com:parksubeom/bumpist-fe-guide.git .fe-guide
```

경로(`.fe-guide`)는 자유. 이후 clone하는 사람은 `git submodule update --init` 한 번 필요.
SSH 키가 없으면 HTTPS로: `https://github.com/parksubeom/bumpist-fe-guide.git`.

## 2. 배선 (스킬 심볼릭 링크 + 규칙 @import)

허브에 포함된 헬퍼를 프로젝트 루트에서 실행한다:

첫 인자로 **프레임워크(`vue` 또는 `react`)**를 준다:

```
sh .fe-guide/apply-to-project.sh vue                # Vue 프로젝트
sh .fe-guide/apply-to-project.sh react              # React 프로젝트
sh .fe-guide/apply-to-project.sh vue vendor/guide   # submodule 경로가 다르면 2번째 인자
```

스크립트가 하는 일:

- `.claude/skills` → `../.fe-guide/skills` **심볼릭 링크** 생성 (Claude Code는 `.claude/skills/`만 읽음).
- 루트 `CLAUDE.md`에 붙여넣을 **규칙 @import 블록**을 출력 — **공통(`rules/*.md`) + 선택 프레임워크
  (`rules/<vue|react>/*.md`)**. 예:
  ```markdown
  @.fe-guide/rules/00-core.md
  … (공통 rules/\*.md 전부)
  @.fe-guide/rules/vue/code-style.md
  … (rules/vue/\*.md 전부)
  ```
  이 줄들을 프로젝트 `CLAUDE.md`에 추가하면 규칙이 로드된다.

수동으로 하려면 위 두 가지(심볼릭 링크 + @import)를 직접 해도 된다.

## 3. 확인

```
ls .claude/skills/     # 스킬 목록이 보이면 정상
```

Claude Code 세션에서 스킬(`create-component` 등)이 인식되는지 확인.

## 4. 갱신

허브가 바뀌면 각 프로젝트에서:

```
git submodule update --remote .fe-guide
```

규칙이 늘거나 줄면 2번의 헬퍼를 다시 실행해 @import 블록을 갱신한다.

## 5. 새 프로젝트 부트스트랩(선택)

빈 프로젝트라면 `setup-fe-project` 스킬로 모노레포·품질 게이트·테스트 툴링을 구성한다.
마지막 검증:

```
pnpm install && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build
```

## 버전 관리 (git 태그)

허브는 릴리스마다 **git 태그**(`v1.2.0`)로 버전을 매긴다. submodule은 특정 커밋을 가리키므로
**태그를 checkout 하면 그 버전에 고정**된다 — 포인터가 곧 버전 기록이라 별도 파일이 필요 없다.

- **특정 버전으로 고정** — submodule 추가(1번) 후 그 안에서 태그를 checkout:
  ```
  cd .fe-guide && git checkout v0.1.0 && cd ..
  git add .fe-guide && git commit -m "chore: pin guide v0.1.0"
  ```
- **지금 몇 버전인지** — `git -C .fe-guide describe --tags`
- **버전 올리기/내리기** — `git submodule update --remote`(최신 추적) 대신 원하는 태그를 checkout:
  ```
  cd .fe-guide && git fetch --tags && git checkout v0.3.0 && cd ..
  sh .fe-guide/apply-to-project.sh vue      # 규칙이 늘/줄었으면 @import 갱신
  git add .fe-guide .claude/skills CLAUDE.md && git commit -m "chore: bump guide → v0.3.0"
  ```
- **옛 버전 패치** — 허브에서 그 태그로 유지보수 브랜치를 파생해 패치 태그(예: `v0.1.1`)를 낸다.

버전 번호 의미(MAJOR/MINOR/PATCH)와 기여 정책(무엇을 허브에 올리나)은
[README](./README.md#버전-관리-git-태그) 참고.

## 참고

### Windows에서 clone한 경우

Windows는 기본적으로 심볼릭 링크를 복원하지 못해 `.claude/skills`가 깨져 보일 수 있다.
`git config --global core.symlinks true`(+ "개발자 모드") 후 다시 clone하거나, 헬퍼 대신
`.fe-guide/skills`를 `.claude/skills`로 복사한다(수정은 항상 허브에서).

### 복사 방식(대안)

submodule을 쓰지 않을 거면 `.fe-guide` 대신 이 저장소 내용을 프로젝트에 복사하고 심볼릭 링크·
@import 경로를 그에 맞게 바꾼다. 단 허브 갱신이 자동 반영되지 않아 드리프트가 생긴다.
