#!/usr/bin/env sh
# 공유 프론트엔드 가이드 허브를 소비 프로젝트에 배선한다.
# 이 허브 repo를 git submodule로 추가한 뒤, 소비 프로젝트 루트에서 실행한다.
#
#   git submodule add git@github.com:parksubeom/bumpist-fe-guide.git .fe-guide
#   sh .fe-guide/apply-to-project.sh <vue|react> [hub경로]
#   예)  sh .fe-guide/apply-to-project.sh vue
#        sh .fe-guide/apply-to-project.sh react vendor/guide
#
# 하는 일: (1) .claude/skills 심볼릭 링크  (2) 공통 + 선택 프레임워크 규칙의 @import 블록 출력.
set -eu

FW="${1:-}"
HUB="${2:-.fe-guide}"

case "$FW" in
  vue | react) ;;
  *)
    echo "사용법: sh $HUB/apply-to-project.sh <vue|react> [hub경로]"
    echo "  프레임워크(vue 또는 react)를 첫 인자로 지정하세요."
    exit 1
    ;;
esac

if [ ! -d "$HUB/skills" ]; then
  echo "error: '$HUB/skills' 를 찾을 수 없습니다."
  echo "  먼저 이 허브를 submodule로 추가하세요:  git submodule add git@github.com:parksubeom/bumpist-fe-guide.git $HUB"
  exit 1
fi

# 1) 런타임 스킬 심볼릭 링크 (.claude/skills -> ../$HUB/skills)
mkdir -p .claude
if [ -L .claude/skills ] || [ -e .claude/skills ]; then
  echo "note: .claude/skills 가 이미 있습니다 — 건너뜁니다(필요하면 직접 확인)."
else
  ln -s "../$HUB/skills" .claude/skills
  echo "created: .claude/skills -> ../$HUB/skills"
fi

# 2) 규칙 @import 블록 (공통 + 선택 프레임워크)
echo
echo "루트 CLAUDE.md 에 아래 줄을 추가하세요 (프레임워크: $FW):"
echo "----------------------------------------"
for f in "$HUB"/rules/*.md; do
  [ -e "$f" ] || continue
  echo "@$f"
done
for f in "$HUB"/rules/"$FW"/*.md; do
  [ -e "$f" ] || continue
  echo "@$f"
done
echo "----------------------------------------"
echo
echo "확인:  ls .claude/skills/   (스킬 목록이 보이면 정상)"
echo "갱신:  git submodule update --remote $HUB   (허브 최신화)"
