'use strict'

// bumpist-code CLI 스모크 테스트 — 의존성 제로(node:test + node:assert).
// CLI가 임시 프로젝트 폴더에서 실제로 파일을 복사·배선하는지, 재실행/에러/자동감지가
// 깨지지 않는지 검증한다. 과거 Node 24 Windows 설치 크래시(재귀 fs)의 회귀 방지가 목적.

const { test } = require('node:test')
const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const CLI = path.join(__dirname, '..', 'bin', 'cli.js')

// 수동 재귀 삭제. fs.rmSync(dir, { recursive: true }) 는 Node 24 Windows 에서
// 네이티브 크래시(STATUS_STACK_BUFFER_OVERRUN, exit 3221226505)를 일으킨다 —
// CLI가 재귀 fs 를 피하는 이유와 동일. 테스트 정리도 안전한 조합으로 한다.
function rmrf(target) {
  if (!fs.existsSync(target)) return
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const t = path.join(target, entry.name)
    if (entry.isDirectory()) rmrf(t)
    else fs.unlinkSync(t)
  }
  fs.rmdirSync(target)
}

// 만든 임시 폴더를 모아 뒀다 프로세스 종료 시 한꺼번에 정리한다. 테스트 본문에서 반환된 dir 을
// 계속 읽어야 하므로 즉시 삭제하지 않고(assert 전에 사라짐), t.after 같은 러너 API에도 의존하지
// 않는다 — Node 18~24 어디서나 동일하게 동작하도록.
const tempDirs = []
process.on('exit', () => {
  for (const d of tempDirs) rmrf(d)
})

// 격리된 임시 프로젝트에서 CLI를 돌리고 결과를 돌려준다.
// setup은 프로젝트 폴더를 준비하는 콜백(예: package.json/CLAUDE.md 심기).
function runInTemp(cliArgs, setup) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bumpist-test-'))
  tempDirs.push(dir)
  if (setup) setup(dir)
  let stdout = ''
  let status = 0
  try {
    stdout = execFileSync(process.execPath, [CLI, ...cliArgs], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (e) {
    status = e.status ?? 1
    stdout = (e.stdout || '') + (e.stderr || '')
  }
  return { dir, stdout, status }
}

function exists(dir, ...p) {
  return fs.existsSync(path.join(dir, ...p))
}

for (const fw of ['vue', 'react', 'next']) {
  test(`init ${fw}: 스킬·규칙·버전·CLAUDE.md를 배선한다`, () => {
    const { dir, status } = runInTemp(['init', fw])
    assert.equal(status, 0, 'exit 0 이어야 함')

    // 스킬 복사됨 + setup-fe-project 는 제외됨
    assert.ok(exists(dir, '.claude', 'skills', 'plan-feature', 'SKILL.md'), 'plan-feature 스킬')
    assert.ok(!exists(dir, '.claude', 'skills', 'setup-fe-project'), 'setup-fe-project 는 제외')

    // 공통 규칙 + 프레임워크 규칙
    assert.ok(exists(dir, '.claude', 'rules', '00-core.md'), '공통 규칙')
    assert.ok(exists(dir, '.claude', 'rules', fw, 'code-style.md'), `${fw} 규칙`)

    // 버전 스탬프
    const stamp = fs.readFileSync(path.join(dir, '.claude', '.guide-version'), 'utf8')
    assert.match(stamp, new RegExp(`framework: ${fw}`), '버전 스탬프에 프레임워크 기록')

    // CLAUDE.md 생성 + @import 블록
    const claudeMd = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8')
    assert.match(claudeMd, /@\.claude\/rules\/00-core\.md/, '@import 블록')
    assert.match(claudeMd, new RegExp(`@\\.claude/rules/${fw}/`), `${fw} @import`)
  })
}

test('프레임워크 인자 없으면 package.json에서 자동 감지한다', () => {
  const { dir, stdout, status } = runInTemp([], (d) => {
    fs.writeFileSync(
      path.join(d, 'package.json'),
      JSON.stringify({ name: 'x', dependencies: { vue: '^3.5.0' } }),
    )
  })
  assert.equal(status, 0)
  assert.match(stdout, /자동 감지/)
  assert.ok(exists(dir, '.claude', 'rules', 'vue', 'code-style.md'), 'vue 규칙 감지 복사')
})

test('next 는 react보다 우선 감지된다', () => {
  const { dir } = runInTemp([], (d) => {
    fs.writeFileSync(
      path.join(d, 'package.json'),
      JSON.stringify({ name: 'x', dependencies: { next: '^15', react: '^19' } }),
    )
  })
  assert.ok(exists(dir, '.claude', 'rules', 'next', 'routing.md'), 'next 규칙')
  assert.ok(!exists(dir, '.claude', 'rules', 'react', 'code-style.md'), 'react 규칙 아님')
})

test('재실행해도 크래시 없이 idempotent 하다 (Node 24 재귀 fs 회귀 방지)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bumpist-rerun-'))
  tempDirs.push(dir)
  const run = () =>
    execFileSync(process.execPath, [CLI, 'init', 'react'], { cwd: dir, encoding: 'utf8' })
  run()
  // 두 번째 실행: removeDir + copyDir 경로가 실제로 도는 지점. 여기서 크래시났었다.
  assert.doesNotThrow(run, '재실행이 던지지 않아야 함')
  assert.ok(exists(dir, '.claude', 'skills', 'plan-feature', 'SKILL.md'))
})

test('잘못된 프레임워크는 exit 1로 실패한다', () => {
  const { status, stdout } = runInTemp(['init', 'svelte'])
  assert.equal(status, 1)
  assert.match(stdout, /vue·react·next/)
})

test('감지 실패 시(빈 폴더, 인자 없음) exit 1', () => {
  const { status, stdout } = runInTemp([])
  assert.equal(status, 1)
  assert.match(stdout, /감지하지 못/)
})

test('기존 CLAUDE.md 는 덮어쓰지 않고 추가할 줄을 안내한다', () => {
  const original = '# 내 프로젝트\n\n중요한 기존 내용\n'
  const { dir, stdout } = runInTemp(['init', 'vue'], (d) => {
    fs.writeFileSync(path.join(d, 'CLAUDE.md'), original)
  })
  const after = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8')
  assert.equal(after, original, '기존 CLAUDE.md 보존')
  assert.match(stdout, /직접 추가하세요/, '추가 안내 출력')
})

test('-h / --help 는 사용법을 출력하고 exit 0', () => {
  const { status, stdout } = runInTemp(['-h'])
  assert.equal(status, 0)
  assert.match(stdout, /사용법:/)
})
