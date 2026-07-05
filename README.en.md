<p align="center">
  <img src="./assets/banner.svg" alt="Bumpist Code — Bump the rules. Ship consistent frontends." width="100%">
</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/bumpist-code?style=flat-square&color=6d6afe&label=bumpist-code">
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Claude Code" src="https://img.shields.io/badge/Claude%20Code-skills-6d6afe?style=flat-square">
  <img alt="Architecture" src="https://img.shields.io/badge/architecture-FSD-ff7a45?style=flat-square">
</p>

# Bumpist Code

> **Bump the rules. Ship consistent frontends.**
> Frontend standards for Vue · React · Next.js, plus 14 Claude Code skills that enforce them — set up in your project with one command.

```sh
npx bumpist-code@latest init   # auto-detects vue | react | next, wires rules & skills into .claude/
```

All you need is **Node 18+** and **[Claude Code](https://claude.com/claude-code)**. No account, no server, no extra config.

> **Full documentation is in Korean** — this page is a summary for English readers.
> See the [Korean README](./README.md) for the complete guide.

## Why

Vibe coding has chronic diseases: project structure decays, security is an afterthought, and quality changes from session to session. Bumpist Code pins quality down with **rules + skills**: you don't memorize conventions — Claude Code reads them before it works, every time.

One `npx` command installs the standard into your project:

- **13 shared rules** — guardrails, project structure (Feature-Sliced Design), design baseline, accessibility, API types, testing, git/PR policy, security, CI — plus framework-specific rule sets for **Vue**, **React**, and **Next.js (App Router)** — copied into `.claude/rules`
- **14 Claude Code skills** that turn those rules into executable workflows — 13 are copied into `.claude/skills`; the 14th, `setup-fe-project`, ships inside the package and drives new-project bootstrap
- **3 app-template tracks** (Vue · React · Next.js) bundled in the package — used by `setup-fe-project` when bootstrapping a new project, so setup is copy-and-run (they are not copied into `.claude`)
- A `CLAUDE.md` wired with `@import` (created if you don't have one; if you do, the CLI prints the import block for you to paste), and the installed version recorded in `.claude/.guide-version`

Everything is a **copy** — your repo owns it, nothing phones home, and updating means re-running the command with a newer version (semver, pinnable: `npx bumpist-code@0.5.1 init vue`).

## What it standardizes

TypeScript strict · Feature-Sliced Design · Tailwind v4 + `cva`/`cn` + design tokens · TanStack Query · openapi-typescript · pnpm + Turborepo monorepo · Vitest + Playwright + Storybook · oxlint + ESLint + Prettier + commitlint + husky.

Per-framework tracks: **Vue** (Vue Router, Pinia, vue-i18n), **React** (React Router, Zustand, react-i18next), **Next.js** (App Router, RSC fetch + Server Actions, Zustand, next-intl).

## Skills

| Skill | What it does |
| --- | --- |
| `dev-workflow` | Entry point — routes any task to the right rules and skill |
| `plan-feature` | Interviews intent on big/vague tasks, plans steps, delegates to build skills |
| `setup-fe-project` | Bootstraps a pnpm + Turborepo monorepo with quality gates and test tooling |
| `create-component` | Component + story + spec scaffold (typed Props, cva/cn, dark mode, a11y, i18n) |
| `implement-from-figma` | Reads Figma designs via MCP, implements to tokens and conventions |
| `create-slice` | FSD slice scaffold (ui/model/api + public API) |
| `gen-api-types` | Regenerates types from OpenAPI and wires type-safe Query hooks |
| `gen-tokens` | Regenerates Tailwind design tokens from a Token Studio export |
| `write-test` | Picks the right layer: unit, component, MSW integration, Playwright E2E |
| `debug-issue` | Reproduce → hypothesis → verify → minimal fix → regression spec |
| `create-adr` | Records architecture decisions |
| `review-changes` | Self-reviews the current diff against the rules |
| `prepare-commit` | Branch guard + concern check + conventional commit message |
| `prepare-pr` | Runs the verification runbook and fills in the PR description |

Typical flow: say *"build the member list screen"* → `plan-feature` → `create-slice` / `create-component` → `write-test` → `review-changes` → `prepare-commit` → `prepare-pr`.

## Battle-tested on a real MVP

The Next.js track was validated by building **[re-pin](https://github.com/parksubeom/re-pin)** — a production MVP for managing design-revision requests in outsourced/freelance work — from `setup-fe-project` bootstrap all the way through Supabase persistence, authentication, and a security pass.

Three real-world landmines found along the way shipped as fixes in **v0.5.1**: the FSD `pages` layer renamed to `pageViews` to avoid colliding with the Next.js router, migration to `typescript-eslint` (eslint-config-next has flat-config/pnpm friction), and Vitest test collection scoped to intended directories.

## Design baseline

Neutral and flat, one brand color, token-first, WCAG AA, restrained motion, and empty/loading/error states finished first — a baseline that doesn't fight any brand. For deeper design craft, it pairs with [impeccable](https://github.com/pbakaus/impeccable) (optional, installed separately).

## Learn more (Korean)

- [Full README](./README.md) — complete rules, scenarios, and internals
- [install.md](./install.md) — installation details
- [skills/README.md](./skills/README.md) — per-skill documentation
- [glossary.md](./glossary.md) — plain-language glossary for newcomers

## License

MIT
