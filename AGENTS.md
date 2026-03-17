<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making changes, adding new packages, or discovering important conventions, update the relevant sections. -->

# JavaScript - Agent Guide

This repository is a collection of shared developer tool configurations published as npm packages under the `@tada5hi` scope.
It provides meaningful default ESLint rules, TypeScript compiler settings, Prettier formatting, commitlint conventions,
and semantic-release configuration used across all tada5hi projects.

## Quick Reference

```bash
# Setup
npm install                    # install all dependencies + symlink between packages

# Testing
npm test                       # run vitest tests for all config packages

# Publishing
npx workspaces-publish         # publish all packages
```

- **Node.js**: `>=22.0.0`
- **Package manager**: npm with workspaces
- **Scope**: All packages are published under `@tada5hi/*`
- **ESLint**: `>=9.0.0` (flat config format)

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

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Monorepo layout, packages, and dependency relationships
- **[Conventions](.agents/conventions.md)** — Coding style, tooling, release process, and best practices
