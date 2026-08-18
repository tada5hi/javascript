<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making changes, adding new packages, or discovering important conventions, update the relevant sections. -->

# JavaScript - Agent Guide

This repository is a collection of shared developer tool configurations published as npm packages under the `@tada5hi` scope.
It provides meaningful default ESLint rules, TypeScript compiler settings, Prettier formatting, commitlint conventions,
and semantic-release configuration used across all tada5hi projects.

## Quick Reference

```bash
# Setup
npm install                    # install all dependencies + symlink between packages

# Development
npm run build                  # nx run-many --target=build (all packages)
npm test                       # nx run-many --target=test (config packages with tests)
npm run lint                   # eslint .
npm run lint:fix               # eslint . --fix

# Publishing
npx monoship                   # publish all packages
```

- **Node.js**: `>=22.0.0`
- **Package manager**: npm with workspaces
- **Build orchestration**: nx (cached, `dependsOn: ^build`)
- **Bundler**: tsdown (every package except `tsconfig`)
- **Scope**: All packages are published under `@tada5hi/*`
- **ESLint peer requirement**: `>=10.0.0` (flat config format)

All packages are libraries in `packages/` — there are no runnable applications and no CLI binaries.

### Packages Overview

| Package | Purpose |
|---------|---------|
| `@tada5hi/eslint-config` | Unified ESLint flat config (JS + optional TS/Vue via async factory) |
| `@tada5hi/eslint-config-typescript` | Deprecated — thin wrapper over `@tada5hi/eslint-config` |
| `@tada5hi/eslint-config-vue` | Deprecated — thin wrapper over `@tada5hi/eslint-config` |
| `@tada5hi/eslint-config-vue-typescript` | Deprecated — thin wrapper over `@tada5hi/eslint-config` |
| `@tada5hi/prettier-config` | Prettier formatting configuration |
| `@tada5hi/tsconfig` | Shared TypeScript compiler configuration |
| `@tada5hi/commitlint-config` | Commitlint conventional commit rules |
| `@tada5hi/semantic-release` | Semantic-release shared configuration |

### Dogfooding

The repository lints itself with its own config — the root `eslint.config.js` imports `@tada5hi/eslint-config` through
the workspace symlink, which resolves to `dist/`. **Run `npm run build` before `npm run lint`** after changing any rule,
otherwise lint runs against the previously built config.

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Monorepo layout, packages, and dependency relationships
- **[Architecture](.agents/architecture.md)** — Async factory, config-module composition, and optional-dependency loading
- **[Testing](.agents/testing.md)** — Vitest setup, per-package configs, and the `Linter` API assertion pattern
- **[Conventions](.agents/conventions.md)** — Coding style, tooling, unicorn rule set, release process, and best practices

## Commits, Issues & Pull Requests

- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint via a Husky `commit-msg` hook.
- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
- Do **not** add AI-attribution lines (e.g. `🤖 Generated with [Claude Code](...)`) to issue or pull request titles, bodies, or comments.
