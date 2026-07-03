#!/usr/bin/env node
'use strict'

// bumpist-code — 규칙·스킬을 프로젝트로 복사하고 CLAUDE.md 배선을 안내한다.
//   npx bumpist-code init vue     (또는 react)
// apply-to-project.sh 의 복사 로직을 Node로 옮긴 것. 의존성 없음.

const fs = require('fs')
const path = require('path')

const PKG_ROOT = path.join(__dirname, '..')
const CWD = process.cwd()
const pkg = require(path.join(PKG_ROOT, 'package.json'))

function fail(msg) {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

function usage() {
  console.log(`
bumpist-code v${pkg.version}

사용법:
  npx bumpist-code init [vue|react|next]
  (프레임워크 생략 시 package.json에서 자동 감지)

하는 일 (모두 복사):
  - 스킬  → .claude/skills/   (setup-fe-project 제외)
  - 규칙  → .claude/rules/    (공통 + 선택 프레임워크)
  - 템플릿 → docs/ai/
  - 버전 기록 → .claude/.guide-version
  - CLAUDE.md 에 @import 블록 생성/안내
`)
}

const FRAMEWORKS = ['vue', 'react', 'next']

// 소비 프로젝트 package.json에서 프레임워크 자동 감지 (next 우선 — Next는 react도 함께 가짐)
function detectFramework() {
  try {
    const p = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'))
    const deps = { ...p.dependencies, ...p.devDependencies }
    if (deps.next) return 'next'
    if (deps.vue) return 'vue'
    if (deps.react) return 'react'
  } catch {}
  return null
}

// 인자 파싱: `init vue` | `vue` 둘 다 허용, 없으면 자동 감지
const args = process.argv.slice(2).filter((a) => a !== 'init')
if (args[0] === '-h' || args[0] === '--help') {
  usage()
  process.exit(0)
}
let fw = args[0]
let detected = false
if (!fw) {
  fw = detectFramework()
  detected = true
  if (!fw) {
    usage()
    fail('프레임워크를 감지하지 못했습니다 — vue·react·next 중 하나를 인자로 주세요.')
  }
}
if (!FRAMEWORKS.includes(fw)) {
  fail(`프레임워크는 vue·react·next 중 하나여야 합니다. 받은 값: "${fw}"`)
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  fs.cpSync(src, dest, { recursive: true })
}

function copyMdFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0
  fs.mkdirSync(destDir, { recursive: true })
  let n = 0
  for (const f of fs.readdirSync(srcDir)) {
    if (!f.endsWith('.md')) continue
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f))
    n++
  }
  return n
}

console.log(`\nbumpist-code v${pkg.version} → ${fw}${detected ? ' (자동 감지)' : ''}\n`)

// 1) 스킬 복사 (setup-fe-project 제외)
const skillsSrc = path.join(PKG_ROOT, 'skills')
const skillsDest = path.join(CWD, '.claude', 'skills')
fs.mkdirSync(skillsDest, { recursive: true })
let skillCount = 0
for (const name of fs.readdirSync(skillsSrc)) {
  const s = path.join(skillsSrc, name)
  if (!fs.statSync(s).isDirectory()) continue
  if (name === 'setup-fe-project') continue
  fs.rmSync(path.join(skillsDest, name), { recursive: true, force: true })
  copyDir(s, path.join(skillsDest, name))
  skillCount++
}
console.log(`  copied  .claude/skills/       (${skillCount}개 스킬, setup-fe-project 제외)`)

// 2) 규칙 복사 (공통 + 선택 프레임워크)
const rulesDest = path.join(CWD, '.claude', 'rules')
const common = copyMdFiles(path.join(PKG_ROOT, 'rules'), rulesDest)
const fwCount = copyMdFiles(path.join(PKG_ROOT, 'rules', fw), path.join(rulesDest, fw))
console.log(`  copied  .claude/rules/        (공통 ${common} + ${fw} ${fwCount})`)

// 3) 템플릿 복사
const docsCount = copyMdFiles(path.join(PKG_ROOT, 'docs', 'ai'), path.join(CWD, 'docs', 'ai'))
if (docsCount) console.log(`  copied  docs/ai/              (템플릿 ${docsCount})`)

// 4) 버전 도장
const today = new Date().toISOString().slice(0, 10)
fs.writeFileSync(
  path.join(CWD, '.claude', '.guide-version'),
  `guide: bumpist-code\nversion: v${pkg.version}\nframework: ${fw}\nadopted: ${today}\n`,
)
console.log(`  stamped .claude/.guide-version (v${pkg.version})`)

// 5) @import 블록 만들기
const importLines = []
for (const f of fs.readdirSync(rulesDest)) {
  if (f.endsWith('.md')) importLines.push(`@.claude/rules/${f}`)
}
const fwDir = path.join(rulesDest, fw)
if (fs.existsSync(fwDir)) {
  for (const f of fs.readdirSync(fwDir)) {
    if (f.endsWith('.md')) importLines.push(`@.claude/rules/${fw}/${f}`)
  }
}
const block = importLines.join('\n')
const claudeMd = path.join(CWD, 'CLAUDE.md')
const marker = '<!-- bumpist-code:rules -->'

if (!fs.existsSync(claudeMd)) {
  fs.writeFileSync(claudeMd, `# CLAUDE.md\n\n${marker}\n${block}\n`)
  console.log(`  created CLAUDE.md              (@import 블록 포함)`)
  console.log('\n✔ 완료. 이제 Claude Code에서 하고 싶은 걸 말하면 규칙대로 작업해요.')
} else {
  console.log('\n✔ 복사 완료. CLAUDE.md 가 이미 있으니, 아래 줄을 직접 추가하세요:')
  console.log('\n----------------------------------------')
  console.log(block)
  console.log('----------------------------------------')
}
console.log(`\n확인:  ls .claude/skills/\n`)
