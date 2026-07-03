#!/usr/bin/env sh
# Bumpist Code 가이드를 소비 프로젝트에 **복사**한다.
# 허브를 받아온(degit 또는 clone) 뒤, 소비 프로젝트 루트에서 실행하고, 끝나면 임시 폴더를 지운다.
#
#   npx degit parksubeom/bumpist-fe-guide .bumpist
#   sh .bumpist/apply-to-project.sh <vue|react> .bumpist
#   rm -rf .bumpist
#
# 하는 일 (모두 **복사**, 링크 아님):
#   (1) 스킬 → .claude/skills (setup-fe-project 제외 = 부트스트랩 전용)
#   (2) 규칙 → .claude/rules (공통 + 선택 프레임워크)
#   (3) 템플릿 → docs/ai
#   (4) .claude/.guide-version 기록 + 붙여넣을 @import 블록 출력
set -eu

FW="${1:-}"
HUB="${2:-.bumpist}"

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
  echo "  먼저 허브를 받으세요:  npx degit parksubeom/bumpist-fe-guide $HUB"
  exit 1
fi

# 1) 스킬 복사 (setup-fe-project 제외)
mkdir -p .claude/skills
for d in "$HUB"/skills/*/; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  [ "$name" = "setup-fe-project" ] && continue
  rm -rf ".claude/skills/$name"
  cp -R "$d" ".claude/skills/$name"
done
echo "copied: .claude/skills/ (setup-fe-project 제외)"

# 2) 규칙 복사 (공통 + 선택 프레임워크)
mkdir -p ".claude/rules/$FW"
cp "$HUB"/rules/*.md .claude/rules/ 2>/dev/null || true
cp "$HUB"/rules/"$FW"/*.md ".claude/rules/$FW/" 2>/dev/null || true
echo "copied: .claude/rules/ (공통 + $FW)"

# 3) 템플릿 복사
if [ -d "$HUB/docs/ai" ]; then
  mkdir -p docs/ai
  cp "$HUB"/docs/ai/*.md docs/ai/ 2>/dev/null || true
  echo "copied: docs/ai/"
fi

# 4) 버전 도장 (.guide-version) — 3번째 인자로 버전을 주거나(degit 시), 없으면 git에서 추론
VER="${3:-}"
[ -z "$VER" ] && VER=$(git -C "$HUB" describe --tags --always 2>/dev/null || echo "unknown")
{
  echo "guide: bumpist-fe-guide"
  echo "version: $VER"
  echo "framework: $FW"
  echo "adopted: $(date +%F)"
} > .claude/.guide-version
echo "stamped: .claude/.guide-version (version: $VER)"

# 5) 규칙 @import 블록 (복사된 위치 기준)
echo
echo "루트 CLAUDE.md 에 아래 줄을 추가하세요 (프레임워크: $FW):"
echo "----------------------------------------"
for f in .claude/rules/*.md; do
  [ -e "$f" ] || continue
  echo "@$f"
done
for f in .claude/rules/"$FW"/*.md; do
  [ -e "$f" ] || continue
  echo "@$f"
done
echo "----------------------------------------"
echo
echo "확인:  ls .claude/skills/   (스킬 목록이 보이면 정상)"
echo "임시 폴더 삭제:  rm -rf $HUB"
