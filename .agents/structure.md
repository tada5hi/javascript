# Project Structure

The project is a monorepo using npm workspaces. All packages live under `packages/` and are published to npm under the `@tada5hi` scope.

## Repository Layout

```
javascript/
├── .agents/                              # Agent documentation
│   ├── plans/                            # Migration and implementation plans
│   ├── structure.md                      # This file
│   └── conventions.md                    # Coding conventions
├── .github/                              # GitHub workflows (CI, release-please)
├── .husky/                               # Git hooks
│   └── commit-msg                        # Commitlint enforcement
├── packages/                             # All workspace packages
│   ├── commitlint-config/                # Commitlint configuration
│   ├── eslint-config/                    # Unified ESLint flat config (JS + optional TS/Vue)
│   ├── eslint-config-typescript/         # Deprecated — thin wrapper over eslint-config
│   ├── eslint-config-vue/                # Deprecated — thin wrapper over eslint-config
│   ├── eslint-config-vue-typescript/     # Deprecated — thin wrapper over eslint-config
│   ├── prettier-config/                  # Prettier configuration
│   ├── semantic-release/                 # Semantic-release configuration
│   └── tsconfig/                         # TypeScript compiler configuration
├── vitest.config.js                      # Root test configuration
├── commitlint.config.js                  # Root commitlint (uses own package)
├── package.json                          # Root workspace definition
├── release-please-config.json            # Release-please configuration
└── .release-please-manifest.json         # Version manifest
```

## Packages

### ESLint Configuration

The unified `eslint-config` package provides an async factory function with optional TypeScript and Vue support via auto-detection or explicit options. The satellite packages (`eslint-config-typescript`, `eslint-config-vue`, `eslint-config-vue-typescript`) are deprecated thin wrappers that delegate to the unified package.

| Package | Status | Description |
|---------|--------|-------------|
| `eslint-config` | **Active** | Unified ESLint flat config with optional TS/Vue support |
| `eslint-config-typescript` | Deprecated | Thin wrapper → `eslintConfig({ typescript: options })` |
| `eslint-config-vue` | Deprecated | Thin wrapper → `eslintConfig({ vue: true })` |
| `eslint-config-vue-typescript` | Deprecated | Thin wrapper → `eslintConfig({ typescript: options, vue: true })` |

#### Unified Package Structure

```
packages/eslint-config/
├── src/
│   ├── index.ts              # Async factory function + type re-exports
│   ├── types.ts              # FactoryOptions, UserConfig (re-exports TypeScriptOptions, VueOptions)
│   ├── utils.ts              # isPackageExists() helper
│   └── configs/
│       ├── javascript/       # @eslint/js recommended + core rules
│       │   ├── module.ts
│       │   ├── types.ts
│       │   └── index.ts
│       ├── stylistic/        # @stylistic plugin formatting rules
│       │   ├── module.ts
│       │   ├── types.ts
│       │   └── index.ts
│       ├── imports/          # import-lite plugin + sort-imports
│       │   ├── module.ts
│       │   ├── types.ts
│       │   └── index.ts
│       ├── unicorn/          # unicorn plugin modern JS rules
│       │   ├── module.ts
│       │   ├── types.ts
│       │   └── index.ts
│       ├── typescript/       # typescript-eslint (dynamic import)
│       │   ├── module.ts
│       │   ├── types.ts      # TypeScriptOptions
│       │   └── index.ts
│       └── vue/              # eslint-plugin-vue (dynamic import)
│           ├── module.ts
│           ├── types.ts      # VueOptions
│           └── index.ts
├── test/unit/
│   ├── index.spec.ts         # Factory tests
│   ├── javascript.spec.ts    # JS rule tests
│   ├── typescript.spec.ts    # TS rule tests
│   └── vue.spec.ts           # Vue rule tests
├── test/vitest.config.ts
├── package.json
├── tsconfig.build.json
└── tsdown.config.ts
```

#### Consumer Usage

```js
import eslintConfig from '@tada5hi/eslint-config';

// Auto-detects TS and Vue from installed packages
export default eslintConfig();

// Explicit options
export default eslintConfig({
    typescript: { project: './tsconfig.json' },
    vue: true,
});

// With user overrides (variadic)
export default eslintConfig(
    { typescript: true },
    { rules: { 'no-console': 'off' } },
);
```

#### Config Module Composition

The factory always includes: `javascript` + `stylistic` + `imports` + `unicorn`.
Conditionally adds `typescript` and/or `vue` based on options or auto-detection (checks if `typescript`/`vue` packages are installed).

### Other Configurations

| Package | Description |
|---------|-------------|
| `tsconfig` | Shared `tsconfig.json` — ESNext target, NodeNext modules, strict mode, DOM + ES2022 libs |
| `prettier-config` | Prettier rules — 100-char width, 4-space tabs, trailing commas, single quotes, semicolons |
| `commitlint-config` | Extends `@commitlint/config-conventional`, relaxes body/footer line length limits |
| `semantic-release` | Shared semantic-release config with changelog and git plugins |

## Package Structure

ESLint config packages use TypeScript with tsdown build:

```
packages/<name>/
├── src/
│   └── index.ts          # ESM entry point
├── test/unit/
│   └── index.spec.ts     # Vitest tests
├── test/vitest.config.ts
├── package.json          # Package metadata ("type": "module", dependencies)
├── tsconfig.build.json
├── tsdown.config.ts
└── CHANGELOG.md          # Auto-generated changelog
```

Other config packages:
- `tsconfig` exports a `tsconfig.json` file
- `prettier-config`, `commitlint-config` export CJS `index.js`
- `semantic-release` exports `release.config.js`
