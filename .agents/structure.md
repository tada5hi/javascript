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
│   ├── eslint-config/                    # Base ESLint flat config (JavaScript)
│   ├── eslint-config-typescript/         # TypeScript ESLint flat config
│   ├── eslint-config-vue/                # Vue.js ESLint flat config
│   ├── eslint-config-vue-typescript/     # Vue + TypeScript ESLint flat config
│   ├── eslint-config-nuxt/              # Nuxt ESLint config (deprecated)
│   ├── eslint-config-nuxt-typescript/   # Nuxt + TypeScript ESLint config (deprecated)
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

### ESLint Configurations

These packages form a layered ESLint flat config system. Each variant includes the base and adds framework-specific rules. All ESLint config packages use ESM and export a function returning a flat config array.

| Package | Built on | Description |
|---------|----------|-------------|
| `eslint-config` | `@eslint/js` + `@stylistic/eslint-plugin` + `eslint-plugin-import-x` + `eslint-plugin-unicorn` | Base JavaScript rules: 4-space indent, 150-char max line, single quotes, import ordering, modern JS enforcement |
| `eslint-config-typescript` | `eslint-config` + `typescript-eslint` | Adds TypeScript-specific rules, TS parser, type-aware rules when `project` option is set |
| `eslint-config-vue` | `eslint-config` + `eslint-plugin-vue` | Adds Vue.js SFC linting via `flat/recommended` |
| `eslint-config-vue-typescript` | `eslint-config-typescript` + `eslint-plugin-vue` | Combines TypeScript and Vue rules, configures TS parser for `.vue` files |
| `eslint-config-nuxt` | _(deprecated)_ | Does not support ESLint 9 flat config |
| `eslint-config-nuxt-typescript` | _(deprecated)_ | Does not support ESLint 9 flat config |

#### Consumer Usage

```js
// eslint.config.js (TypeScript project)
import eslintConfigTypescript from '@tada5hi/eslint-config-typescript';

export default [
    ...eslintConfigTypescript({ project: './tsconfig.json' }),
    // project-specific overrides
];

// eslint.config.js (Vue + TypeScript project)
import eslintConfigVueTypescript from '@tada5hi/eslint-config-vue-typescript';

export default [
    ...eslintConfigVueTypescript({ project: './tsconfig.json' }),
];
```

#### Dependency Graph

```
eslint-config (base)
├── eslint-config-typescript
│   └── eslint-config-vue-typescript
└── eslint-config-vue
```

### Other Configurations

| Package | Description |
|---------|-------------|
| `tsconfig` | Shared `tsconfig.json` — ESNext target, NodeNext modules, strict mode, DOM + ES2022 libs |
| `prettier-config` | Prettier rules — 100-char width, 4-space tabs, trailing commas, single quotes, semicolons |
| `commitlint-config` | Extends `@commitlint/config-conventional`, relaxes body/footer line length limits |
| `semantic-release` | Shared semantic-release config with changelog and git plugins |

## Package Structure

ESLint config packages follow this structure:

```
packages/<name>/
├── index.js              # ESM flat config export (function returning config array)
├── package.json          # Package metadata ("type": "module", dependencies)
├── test/
│   └── index.spec.js     # Vitest tests
└── CHANGELOG.md          # Auto-generated changelog
```

Other config packages:
- `tsconfig` exports a `tsconfig.json` file
- `prettier-config`, `commitlint-config` export CJS `index.js`
- `semantic-release` exports `release.config.js`
