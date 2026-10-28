# eslint-plugin-unicorn

External project: [sindresorhus/eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)

Consumed by `packages/eslint-config` — wired in `src/configs/unicorn/module.ts`, covered by `test/unit/unicorn.spec.ts`.

## Version mapping

| This repo | Plugin version | Notes |
|-----------|----------------|-------|
| `@tada5hi/eslint-config` (current) | `^79.0.0` | 396 rules total, 376 non-deprecated; 107 enabled here; requires `eslint >=10.4` |
| `@tada5hi/eslint-config` (previous) | `^73.0.0` | 346 rules total, 338 non-deprecated; 73 enabled |
| `@tada5hi/eslint-config` (older) | `^64.0.0` | 147 rules total; 10 enabled |

## Rule renames / removals to watch

Unknown rule ids are a **hard ESLint error** for consumers, so every major bump needs a rename audit.

| Old rule | Status | Replacement |
|----------|--------|-------------|
| `unicorn/no-instanceof-array` | Deprecated in v73 | `unicorn/no-instanceof-builtins` (covers more built-ins) |
| `unicorn/no-unused-array-method-return` | Removed in v79 | `unicorn/no-unused-builtin-method-return` (also covers Set and Temporal methods) |
| `unicorn/prefer-explicit-viewport-units` | Removed in v79 | — (was never enabled here) |

Deprecations are documented upstream in `docs/deleted-and-deprecated-rules.md`.

## Auditing a version bump

Compare the rule inventory between the installed and previous versions, then check the configured set:

```js
// list non-deprecated rules of the installed version
const plugin = (await import('eslint-plugin-unicorn')).default;
Object.entries(plugin.rules)
    .filter(([, rule]) => !rule.meta?.deprecated)
    .map(([name]) => name);
```

The previous version's inventory can be obtained with `npm pack eslint-plugin-unicorn@<version>` and listing
`package/rules/*.js`. Diff the two lists to get the newly added rules.

`plugin.configs.recommended.rules` indicates which rules upstream considers safe defaults — useful as a filter, but this
repo does **not** extend the recommended preset (see [Unicorn Rule Set](../conventions.md#unicorn-rule-set)).

## Excluded rules and why

| Rule | Reason |
|------|--------|
| `prefer-temporal`, `prefer-get-or-insert-computed` | Suggest APIs newer than the Node 24 baseline |
| `operator-assignment`, `no-useless-concat`, `no-useless-else`, `no-unnecessary-nested-ternary` | Duplicate core rules already set in `src/configs/javascript/module.ts` |
| `logical-assignment-operators` | Duplicates the core ESLint rule of the same name |
| `name-replacements`, `consistent-boolean-name`, `consistent-compound-words`, `consistent-class-member-order` | Opinionated naming/layout, high noise |
| `no-barrel-files` | Conflicts with this repo's barrel-file (`index.ts`) convention |
| `no-top-level-side-effects`, `prefer-smaller-scope`, `max-nested-calls`, `try-complexity`, `id-match` | Noisy in config-style and library code |
| `prefer-private-class-fields`, `no-undeclared-class-members` | Overlap with TypeScript language features |
| `no-invalid-argument-count` | TypeScript compiler already covers this |
| `require-array-sort-compare` | False positive on `['b','a'].sort()`, which is correct for strings; empty schema, so it cannot be tuned |
| `prefer-number-coercion` | Contradicts the enabled core `radix` rule, and `Number()` is not semantically equal to `parseInt()` |
| `comma-spacing`, `indent`, `key-name-casing`, `no-empty-link-text`, `no-javascript-url`, `no-loss-of-precision` | Only lint JSON/CSS/YAML/TOML/Markdown, which this config does not set up — they would never run |
| `no-unnecessary-parameters` | Noisy while code grows (same value at every call site *today*); the autofix rewrites function signatures |
| `no-repeated-call-wrappers` | Refactoring hint rather than a bug; no autofix |
| `prefer-json-import` | Import attributes interact badly with some bundler/TS setups; runtime JSON reads are often deliberate |

## Rules enabled despite a recent runtime requirement

`engines.node` is declared as `>=24.3.0`, which covers the Node side. It cannot express a browser baseline, so these
rules may need a local override in Vue projects targeting pre-2024 browsers:

| Rule | Suggested API | Available from (approx.) |
|------|---------------|--------------------------|
| `prefer-group-by` | `Object.groupBy()` | Node 21 · Chrome 117 · Safari 17.4 |
| `prefer-promise-with-resolvers` | `Promise.withResolvers()` | Node 22 · Chrome 119 · Safari 17.4 |
| `prefer-array-from-async` | `Array.fromAsync()` | Node 22 · Chrome 121 |
| `prefer-iterator-to-array` | `Iterator#toArray()` | Node 22 · Chrome 122 · Safari 18.4 |
| `prefer-set-methods` | `Set#union()` and friends | Node 22 · Chrome 122 |
| `prefer-url-can-parse` | `URL.canParse()` | Node 18.17 · Chrome 120 |
| `prefer-regexp-escape` | `RegExp.escape()` | Node 24 |
| `prefer-error-is-error` | `Error.isError()` | Node 24.3 (see below) |
| `prefer-promise-try` | `Promise.try()` | Node 24 |

### Deliberate exceptions to the Node baseline

These rules suggest APIs that are **not available in Node 24** (verified on v24.22). They are enabled on purpose;
consumers on Node 24 need a polyfill or a local override:

| Rule | Suggested API | `--fix` behaviour |
|------|---------------|-------------------|
| `prefer-uint8array-base64` | `Uint8Array#toBase64()` / `Uint8Array.fromBase64()` | Suggestions only for `Buffer`/`atob`/`btoa`; autofixes only code that already calls `toBase64()` |
| `prefer-uint8array-hex` | `Uint8Array#toHex()` / `Uint8Array.fromHex()` | **Autofixes** `Buffer.from(bytes).toString('hex')` and manual `padStart` loops to `bytes.toHex()`, which throws on Node 24 |
| `prefer-iterator-zip` | `Iterator.zip()` | Suggestions only |

`prefer-uint8array-hex` is the one that can break working code: on Node 24 without a polyfill, `eslint --fix`
produces a `TypeError: bytes.toHex is not a function` at runtime. Consumers in that situation should turn the rule off
locally.

### Why the baseline is 24.3, not 24.0

`prefer-error-is-error` autofixes `e instanceof Error` to `Error.isError(e)`. On Node 24.0–24.2,
`Error.isError(new DOMException())` returns `false` while `instanceof Error` returns `true`, so the fix would change
behaviour for DOMException. Node 24.3.0 returns `true` for both (verified on 24.0.0, 24.2.0 and 24.3.0).

## Rules that need a non-default parser setting

`no-conflicting-constraints`, `no-ineffective-csp-directives` and `no-invalid-integrity` check HTML attributes. In JS
files they only see JSX, so they are inert unless the consumer enables `ecmaFeatures.jsx`. The tests turn JSX on for
these three.
