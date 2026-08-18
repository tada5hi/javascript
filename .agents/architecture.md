# Architecture

## Overview

The repository publishes **configuration as data**. Every package resolves to a single default export that a consumer's
tool loads directly — there is no runtime logic beyond config assembly.

`@tada5hi/eslint-config` is the only package with meaningful architecture. It is a **composable async factory**: a
function that assembles a flat-config array from independent config modules, resolving optional TypeScript and Vue
support at call time.

```
Consumer eslint.config.js
    └── eslintConfig(options, ...userConfigs)      src/module.ts
            ├── always:      javascript + stylistic + imports + unicorn
            ├── optional:    typescript          (dynamic import)
            ├── optional:    vue                 (dynamic import)
            └── appended:    ...userConfigs      (last wins)
```

## Core Design Decisions

### 1. Async factory over a static array

The factory is `async` so optional integrations can be loaded with dynamic `import()`. A static config array would force
`typescript-eslint` and `eslint-plugin-vue` to be hard dependencies, which every consumer would then install even when
linting plain JavaScript.

### 2. Optional peer dependencies with auto-detection

`typescript-eslint` and `eslint-plugin-vue` are declared as **optional peer dependencies**
(`peerDependenciesMeta.<name>.optional = true`) and imported only when enabled. Enablement is resolved per integration:

| `options.<key>` value | Result |
|-----------------------|--------|
| `true` / `false` | Used directly |
| object | Enabled, object passed as that module's options |
| `undefined` | Auto-detected via `isPackageExists()` in `src/utils.ts` |

This means `eslintConfig()` with no arguments does the right thing in a JS, TS, or Vue project.

### 3. Composition over preset inheritance

The config does not extend an upstream opinionated preset. Each layer is an independent module that returns
`Linter.Config[]`, and the factory concatenates them. This keeps rule ownership explicit — see the
[Rule Philosophy](conventions.md#rule-philosophy) and [Unicorn Rule Set](conventions.md#unicorn-rule-set).

### 4. Deprecated wrappers delegate, never duplicate

`eslint-config-typescript`, `eslint-config-vue` and `eslint-config-vue-typescript` are thin wrappers that call the
unified factory with preset options. They carry no rules of their own, so rule changes only ever happen in one place.

## Design Patterns

### Config Module

Every rule set under `src/configs/<name>/` is a folder of three files — `module.ts` (the function), `types.ts` (its
options), `index.ts` (barrel). A module returns `Linter.Config[]` and is either sync or async.

Sync module — no optional dependency:

```typescript
import type { Linter } from 'eslint';
import unicornPlugin from 'eslint-plugin-unicorn';

export function unicorn(): Linter.Config[] {
    return [
        {
            plugins: { unicorn: unicornPlugin },
            rules: { 'unicorn/prefer-node-protocol': 'error' },
        },
    ];
}
```

Async module — optional dependency, loaded only when enabled:

```typescript
import type { Linter } from 'eslint';
import type { VueOptions } from './types.ts';

export async function vue(options: VueOptions = {}): Promise<Linter.Config[]> {
    const vuePlugin = await import('eslint-plugin-vue');
    // ...
}
```

Conventions:

- The exported function is named after the folder (`javascript`, `imports`, `unicorn`, `typescript`, `vue`).
  `stylistic` is the exception — it exports `stylisticConfig` to avoid colliding with the imported plugin.
- Optional dependencies are imported **inside** the function with `await import()`, never at module top level.
- Options interfaces live in `types.ts`; re-export them from `src/types.ts` only if part of `FactoryOptions`.

### Enablement Resolution

`resolveEnabled()` in `src/module.ts` is the single place that decides whether an optional module loads. New optional
modules should reuse it rather than re-implementing detection.

## Data Flow

```
Input:
  └── FactoryOptions + variadic UserConfig overrides

Processing:
  1. Concatenate the always-on modules (javascript, stylistic, imports, unicorn)
  2. Resolve typescript/vue enablement (explicit boolean > options object > package detection)
  3. Dynamically import and append each enabled optional module
  4. Vue inherits typescript: true when TypeScript is enabled and not explicitly set
  5. Append userConfigs last so consumer overrides win

Output:
  └── Promise<Linter.Config[]> — a flat config array ESLint consumes directly
```

## Error Handling

- No try/catch around optional imports: if a consumer explicitly enables `vue` without installing `eslint-plugin-vue`,
  the import error surfaces directly. That is intentional — a silent fallback would produce a config that lints nothing.
- `isPackageExists()` only answers "is it installed"; it never throws, so auto-detection degrades to "disabled".
- Unknown rule ids are a **hard ESLint error for consumers**, so rule renames in upstream plugins are a breaking change.
  `test/unit/unicorn.spec.ts` guards against this.

## File Structure

```text
packages/eslint-config/src/
├── index.ts                  # public entry — re-exports types, default-exports the factory
├── module.ts                 # eslintConfig() factory + resolveEnabled()
├── types.ts                  # FactoryOptions, UserConfig + option type re-exports
├── utils.ts                  # isPackageExists()
└── configs/
    ├── javascript/           # @eslint/js recommended + core rules       (always)
    ├── stylistic/            # @stylistic formatting rules               (always)
    ├── imports/              # import-lite + sort-imports                (always)
    ├── unicorn/              # eslint-plugin-unicorn rule set            (always)
    ├── typescript/           # typescript-eslint                         (optional, dynamic import)
    └── vue/                  # eslint-plugin-vue                         (optional, dynamic import)
```

## Configuration

The packages have no environment variables. Consumer-facing configuration is the `FactoryOptions` object:

| Option | Purpose |
|--------|---------|
| `typescript` | `boolean` or `TypeScriptOptions` (e.g. `{ project: './tsconfig.json' }`) for type-aware linting |
| `vue` | `boolean` or `VueOptions`; inherits `typescript` when TypeScript is enabled |
| `...userConfigs` | Variadic flat-config objects appended last, so they override everything |
