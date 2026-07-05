# Bumpist Code 런치 킷 (v0.5.1)

> 커뮤니티 채널별 포스팅 초안 모음. **모두 바로 복붙 가능한 완성본**이다.
> 톤 원칙: 진정성 우선, 과장 금지. 통계·사용자 수·별점 언급 금지(실측 근거 없는 수치는 쓰지 않는다).
> 숫자 규칙: 패키지에 스킬은 **14개**, `init`이 `.claude/`로 복사하는 것은 **13개**
> (`setup-fe-project`는 패키지에 동봉돼 새 프로젝트 부트스트랩을 담당). 두 숫자를 섞어 쓰지 않는다.
> 링크는 상황에 맞게 교체: GitHub `https://github.com/parksubeom/bumpist-fe-guide` ·
> npm `https://www.npmjs.com/package/bumpist-code` · re-pin `https://github.com/parksubeom/re-pin`.

핵심 메시지 4축 (모든 채널 공통):

1. **npx 한 줄** — `npx bumpist-code@latest init`. 계정·서버·설정 없음.
2. **규칙을 안 외워도 Claude가 지킨다** — 공통 규칙 13개 + 프레임워크별 규칙 + 스킬 14개 패키지.
   `init` 한 줄로 규칙 전부와 프로젝트용 스킬 13개가 `.claude/`로 배선된다
   (신규 부트스트랩용 `setup-fe-project`는 패키지에 동봉).
3. **실서비스 MVP로 검증** — 이 가이드로 re-pin(수정핀)을 부트스트랩부터 Supabase 영속화·인증·보안 점검까지 완주. 그 과정에서 나온 수정이 v0.5.1에 반영됨.
4. **바이브 코딩의 보안·구조 구멍을 막는다** — 매번 다른 폴더 구조, 허술한 시크릿 관리, 들쭉날쭉한 퀄리티를 규칙+스킬로 고정.

---

## 1. 긱뉴스 (news.hada.io) 제출용

> 형식: 링크 제출. URL은 GitHub 저장소로.

**제목 (1줄):**

```
Bumpist Code — 바이브 코딩의 구조·보안 구멍을 규칙+Claude 스킬로 고정하는 프론트엔드 표준 (npx 한 줄)
```

**URL:**

```
https://github.com/parksubeom/bumpist-fe-guide
```

**소개 (본문):**

```
Claude Code로 프론트엔드를 만들다 보면 세션마다 폴더 구조가 달라지고, 보안·테스트가 빠지고, 퀄리티가 들쭉날쭉해지는 문제가 있습니다. 이걸 "규칙을 외워서" 해결하는 대신, 공통 규칙 13개 + 프레임워크별(Vue·React·Next.js) 규칙 + Claude Code 스킬 14개(프로젝트용 13개 + 새 프로젝트 부트스트랩용 setup-fe-project)를 담은 CLI를 만들었습니다. npx bumpist-code@latest init 한 줄이면 프레임워크를 자동 감지해서 규칙과 프로젝트용 스킬 13개가 .claude/에 배선되고(기존 CLAUDE.md가 있으면 출력된 @import 블록을 붙여넣는 한 단계가 추가됩니다), 이후에는 "회원 목록 화면 만들어줘"처럼 말하면 계획→슬라이스 생성→테스트→커밋까지 정해진 흐름으로 흘러갑니다. Next.js 트랙은 실서비스 MVP(re-pin, 외주 디자인 수정요청 관리 도구)를 부트스트랩부터 인증·보안 점검까지 완주하면서 검증했고, 거기서 발견한 함정 3가지(FSD pages 레이어와 Next 예약 디렉터리 충돌 → pageViews 개명, config-next의 flat config 마찰 → typescript-eslint 전환, vitest 수집 범위 한정)를 v0.5.1에 반영했습니다. MIT 라이선스이고, 필요한 건 Node 18+와 Claude Code뿐입니다.
```

---

## 2. disquiet 프로덕트 소개 (메이커 스토리)

> 형식: 프로덕트 등록 시 소개글. 메이커 1인칭 톤.

```
저는 프론트엔드 개발자이고, Claude Code로 정말 많은 걸 만듭니다. 그런데 만들 때마다 결과물이 달랐습니다. 어제는 FSD로 깔끔하게 나오던 구조가 오늘은 컴포넌트가 한 폴더에 쏟아지고, 시크릿이 코드에 박히고, 테스트는 어느 순간 사라져 있었죠. "바이브 코딩은 되는데, 품질이 안 고정된다"는 게 제 가장 큰 스트레스였습니다.

그래서 제가 지키는 규칙을 전부 문서로 박제하고, 그 규칙을 실제 작업 절차로 옮기는 Claude Code 스킬을 만들어서 한 패키지로 묶었습니다. 그게 Bumpist Code입니다. npx bumpist-code@latest init 한 줄이면 프레임워크(Vue·React·Next.js)를 자동 감지해서 규칙과 프로젝트용 스킬이 프로젝트의 .claude/로 복사됩니다. 이제 규칙을 외울 필요가 없습니다 — Claude가 작업 전에 규칙을 읽고 지키니까요.

말로만 하는 검증이 싫어서, 이 가이드만으로 실서비스 MVP를 하나 완주했습니다. 외주·크몽에서 디자인 수정요청을 관리하는 도구 re-pin(수정핀)인데, 부트스트랩부터 Supabase 영속화, 인증, 보안 점검까지 이 가이드의 흐름대로 갔습니다. 그 과정에서 Next.js 트랙의 함정 3가지를 발견했고 전부 v0.5.1에 반영했습니다. 문서로만 존재하는 표준이 아니라, 실전에서 깨지고 고쳐진 표준입니다.

Claude Code를 쓰는 프론트엔드 개발자, 특히 매번 퀄리티가 불안한 분들이 써보시면 좋겠습니다. MIT 라이선스, 무료입니다.
```

---

## 3. velog / 개인 블로그 글 아웃라인

**제목 후보 3개:**

1. `바이브 코딩 3개월, 매번 결과물이 달랐다 — 그래서 규칙을 npm 패키지로 만들었다`
2. `Claude Code가 내 규칙을 지키게 만드는 법: npx 한 줄로 배선하는 프론트엔드 표준`
3. `규칙 13개 + 스킬 14개로 실서비스 MVP를 완주하고 배운 것 (Bumpist Code 0.5.1)`

**섹션 아웃라인:**

```
## 1. 문제: 바이브 코딩의 고질병
- Claude Code로 빠르게 만드는 건 되는데, 세션마다 결과물이 다르다
- 구체적 증상 3가지: ① 폴더 구조 붕괴(같은 프로젝트인데 컴포넌트 배치가 매번 다름)
  ② 보안 허술(시크릿 하드코딩, env 관리 부재) ③ 테스트·접근성이 조용히 빠짐
- "규칙을 프롬프트에 매번 붙여넣기"는 안 되는 이유 — 잊어버리고, 세션마다 새로 시작

## 2. 접근: 규칙 + 스킬을 프로젝트에 '배선'한다
- 규칙(사람+Claude가 같이 읽는 문서 13개 + 프레임워크별)과
  스킬(규칙을 작업 절차로 옮긴 것 — 패키지에 14개, init이 프로젝트용 13개를 복사하고
  부트스트랩용 setup-fe-project는 패키지에 동봉)의 역할 분리
- CLAUDE.md @import 구조 — Claude가 작업 전에 규칙을 자동으로 읽는 원리
- 설치는 npx bumpist-code@latest init 한 줄, 프레임워크(Vue·React·Next.js) 자동 감지
- 복사 방식이라 내 repo에 종속되지 않고, 버전이 .claude/.guide-version에 얼어붙는 설계

## 3. 실전기: 이 가이드로 실서비스 MVP(re-pin)를 완주했다
- re-pin(수정핀): 외주·크몽 디자인 수정요청 관리 도구 — 부트스트랩부터
  Supabase 영속화·인증·보안 점검까지 이 가이드 흐름("계획→슬라이스→테스트→커밋")대로
- 문서가 실전에서 깨진 지점 3가지와 수정 (v0.5.1 반영):
  ① FSD의 pages 레이어가 Next의 src/pages(Pages Router 예약)와 충돌 → pageViews로 개명
  ② eslint-config-next가 flat config + pnpm에서 마찰 → typescript-eslint 네이티브로 전환
  ③ vitest가 앱 밖 파일까지 수집하는 문제 → 수집 범위 한정
- 교훈: 표준은 써봐야 고쳐진다 — "실전 검증"이라는 말의 실제 의미

## 4. 써보기: 설치 한 줄
- npx bumpist-code@latest init → Claude Code 열고 "기능 계획 잡아줘" (30초 체감 루트)
- 기존 프로젝트에 얹기 vs 새 프로젝트 부트스트랩(setup-fe-project) 두 가지 경로
- 링크: GitHub / npm / re-pin
- (마무리) 나처럼 매번 퀄리티가 불안했던 분들의 피드백 환영 — 이슈로 남겨 달라
```

---

## 4. X / 스레드용 트윗 스레드 (7트윗)

> 주의: X는 한글 1자를 2자로 가중 계산한다(한국어 실효 한도 약 140자). 아래 트윗은 모두
> 280 가중치 이내로 맞췄으니 **문구를 덧붙이지 말고 그대로 발행**할 것. 수정하면 글자 수 재확인.
> 링크는 t.co 축약으로 23자 고정 소모. 코드 블록 없이 붙여넣기.

**1/7 (훅):**

```
Claude Code로 프론트엔드 만들 때 제일 무서운 건 "안 되는 것"이 아니라 "매번 다르게 되는 것"이었습니다.

폴더 구조가 세션마다 바뀌고, 시크릿이 코드에 박히고, 테스트가 조용히 사라지는 것.

그래서 제 규칙을 npm 패키지로 만들었습니다. 🧵
```

**2/7:**

```
Bumpist Code — 프론트엔드 공통 규칙 13개 + 프레임워크별(Vue·React·Next.js) 규칙 + Claude Code 스킬 14개 패키지.

설치는 이 한 줄:

npx bumpist-code@latest init

프레임워크를 자동 감지해 규칙과 프로젝트용 스킬 13개가 .claude/에 배선됩니다.
```

**3/7:**

```
핵심은 "규칙을 안 외워도 Claude가 지킨다"입니다.

CLAUDE.md가 규칙을 @import하니까 Claude가 작업 전에 읽고, "회원 목록 화면 만들어줘"라고 하면 계획→슬라이스 생성→테스트→커밋 흐름으로 알아서 갑니다.

프롬프트에 규칙 붙여넣기를 반복할 필요가 없습니다.
```

**4/7:**

```
문서로만 있는 표준은 믿기 어려워서, 이 가이드만으로 실서비스 MVP를 하나 완주했습니다.

re-pin(수정핀) — 외주·크몽 디자인 수정요청 관리 도구. 부트스트랩부터 Supabase 영속화, 인증, 보안 점검까지 가이드 흐름 그대로.

github.com/parksubeom/re-pin
```

**5/7:**

```
완주하면서 Next.js 트랙 함정 3개를 밟았습니다:

1. FSD pages ↔ Next src/pages 예약 충돌 → pageViews 개명
2. eslint-config-next의 flat config 마찰 → typescript-eslint 전환
3. vitest가 앱 밖 파일까지 수집 → 범위 한정

전부 v0.5.1에 반영했습니다.
```

**6/7:**

```
바이브 코딩을 부정하는 게 아닙니다. 저도 바이브 코딩으로 만듭니다.

다만 속도는 그대로 두고, 구조·보안·테스트라는 바닥만 규칙+스킬로 고정하자는 겁니다.

빠르게 만들되, 매번 같은 퀄리티로.
```

**7/7:**

```
MIT 라이선스, 필요한 건 Node 18+와 Claude Code뿐입니다.

npx bumpist-code@latest init

⭐ github.com/parksubeom/bumpist-fe-guide
📦 npmjs.com/package/bumpist-code

써보고 깨지는 지점이 있으면 이슈로 남겨 주세요. 그게 다음 버전이 됩니다.
```

---

## 5. 카톡 / 슬랙 지인용 짧은 멘트 2종

**A. 캐주얼 (친한 동료·친구):**

```
나 그동안 프론트 만들 때 쓰던 규칙들 npm 패키지로 묶어서 배포했어 ㅋㅋ
Claude Code 쓰는 프로젝트에서 npx bumpist-code@latest init 한 줄 치면
폴더 구조·테스트·커밋 규칙을 Claude가 알아서 지켜줌. 규칙 안 외워도 됨.
이걸로 실서비스 MVP도 하나 완주해봤는데(re-pin이라고 수정요청 관리 툴) 꽤 쓸만해.
시간 나면 한번 돌려보고 이상한 데 있으면 알려줘 👉 github.com/parksubeom/bumpist-fe-guide
```

**B. 정중 (선배·커뮤니티 슬랙 등):**

```
안녕하세요, 사이드로 만들던 걸 하나 공개해서 공유드립니다.
Claude Code로 프론트엔드 작업할 때 세션마다 구조·퀄리티가 달라지는 문제를 겪어서,
제가 지키는 규칙(공통 13개 + Vue/React/Next.js별)과 Claude Code 스킬(프로젝트용 13개 +
부트스트랩용 1개)을 npx bumpist-code@latest init 한 줄로 프로젝트에 배선해 주는 CLI로 만들었습니다.
Next.js 트랙은 실서비스 MVP(re-pin) 부트스트랩을 완주하면서 검증했고,
거기서 발견한 문제들을 v0.5.1에 반영했습니다.
혹시 Claude Code 쓰실 일 있으면 한번 살펴봐 주시고, 피드백 주시면 감사히 반영하겠습니다.
https://github.com/parksubeom/bumpist-fe-guide
```

---

## 6. 채널별 체크리스트 · 첫 주 플랜

### 발행 전 공통 체크

- [ ] `npm publish` 완료 확인 (`npm view bumpist-code version` → 0.5.1)
- [ ] 빈 폴더에서 `npx bumpist-code@latest init next` 실제 성공 확인 (스크린샷 1장 확보 — 포스팅에 재사용)
- [ ] **기존 CLAUDE.md가 있는 프로젝트에서도 리허설** — 이 경우 CLI가 @import 블록을 출력만 하므로
      수동 붙여넣기 한 단계가 실제로 안내되는지 확인 (댓글 질문 1순위 예상 지점)
- [ ] README 상단 배너·뱃지가 GitHub에서 정상 렌더되는지 확인
- [ ] re-pin 저장소 공개 상태·README 정돈 확인 — **README가 비어 있으면 발행하지 않는다**
      (한 줄 소개 + 스크린샷 + "built with bumpist-code" 백링크가 최소선. 검증 클레임의 근거 링크이므로)
- [ ] GitHub 저장소 About(설명·토픽) 채우기 — npm keywords와 맞추기

### 첫 주 플랜

| 시점              | 채널         | 할 일                                                                                       |
| ----------------- | ------------ | -------------------------------------------------------------------------------------------- |
| D0 (publish 직후) | 카톡/슬랙    | 멘트 A·B로 지인 5~10명에게 먼저 공유 → 설치가 실제로 되는지 1차 확인 (외부 공개 전 리허설)  |
| D0~D1             | 긱뉴스       | 지인 확인에서 문제 없으면 §1로 제출. 오전 9~11시대 제출 권장(트래픽). 댓글 질문에 당일 답변 |
| D1                | X/스레드     | §4 스레드 발행. 긱뉴스에 올라갔다면 마지막 트윗에 긱뉴스 링크 추가 가능                     |
| D2~D3             | velog/블로그 | §3 아웃라인으로 실전기 작성·발행. 발행 후 X에 링크 트윗 1개 추가                            |
| D3~D4             | disquiet     | §2로 프로덕트 등록. 블로그 글이 있으면 링크 첨부 (스토리 보강)                              |
| D5~D7             | 회고·수집    | 각 채널 질문·이슈 취합 → GitHub 이슈로 옮기기 → 필요하면 0.5.2 패치                         |

### 채널별 주의점

- **긱뉴스**: 자기 프로젝트 제출은 허용되지만 톤이 광고면 역효과. §1처럼 문제→접근→검증 순서 유지. 댓글에서 기술 질문(FSD, CLAUDE.md @import 원리 등)이 나오면 성실히 답하는 것이 최고의 홍보. "한 줄 설치" 관련 질문에는 기존 CLAUDE.md가 있으면 @import 블록 수동 추가 한 단계가 있음을 먼저 밝힌다.
- **disquiet**: 메이커 스토리가 핵심 소비 포맷. "왜 만들었나"에 분량을 쓰고 기능 나열은 줄인다.
- **X/스레드**: 스레드는 한 번에 전부 발행(끊기면 도달 급감). 4번 트윗(re-pin)에 스크린샷 붙이면 좋음.
- **블로그**: 함정 3종(§3의 3번 섹션)이 검색 유입 포인트 — "next.js fsd pages 충돌", "eslint-config-next flat config" 류 검색어로 들어온다. 코드·에러 메시지를 실제로 붙여 쓸 것.
- **전 채널 공통**: 사용자 수·별점·다운로드 수는 언급하지 않는다(초기라 근거 없음). "실전 검증"의 근거는 항상 re-pin 링크로 구체화한다. 스킬 숫자는 "패키지 14개 / 복사 13개" 구분을 지킨다.

---

## 7. 리스트 제출 (publish + GitHub 메타 설정 후)

> awesome 계열 리스트는 영어 엔트리로 제출한다. 아래 문구 그대로 사용(“14개 복사” 표현 없음).

- **travisvn/awesome-claude-skills** — fork + PR, "Community Skills → Collections & Libraries" 섹션:

  ```
  [Bumpist Code](https://github.com/parksubeom/bumpist-fe-guide) - Frontend rules + Claude Code skills for Vue/React/Next.js (Feature-Sliced Design, TypeScript strict); one `npx bumpist-code init` wires the rules and 13 in-project skills into `.claude`, with bundled app templates for project bootstrap.
  ```

- **VoltAgent/awesome-agent-skills** — fork + PR, Community Skills 섹션. 위와 동일 엔트리(제출 전 그쪽 CONTRIBUTING.md 포맷 확인).

- **hesreallyhim/awesome-claude-code** — **PR 금지, 본인이 직접 브라우저에서 이슈 폼 제출**
  (에이전트/CLI 제출을 명시적으로 금지하는 리스트다):
  `https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml`
  한 줄 설명(객관적 톤, 이모지 금지):

  ```
  CLI that installs a shared frontend standard for Vue/React/Next.js — 13 common rules, framework rule tracks, and Claude Code skills (Feature-Sliced Design, TypeScript strict) — into a project's .claude directory with one npx command; ships app templates for new-project bootstrap.
  ```

- 2차 후보(여력 시): ComposioHQ/awesome-claude-skills, karanb192/awesome-claude-skills — 제출 전 각 CONTRIBUTING.md 직접 확인.
