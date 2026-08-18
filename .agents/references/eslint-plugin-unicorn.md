# eslint-plugin-unicorn

External project: [sindresorhus/eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)

Consumed by `packages/eslint-config` — wired in `src/configs/unicorn/module.ts`, covered by `test/unit/unicorn.spec.ts`.

## Version mapping

| This repo | Plugin version | Notes |
|-----------|----------------|-------|
| `@tada5hi/eslint-config` (current) | `^73.0.0` | 346 rules total, 338 non-deprecated; 75 enabled here |
| `@tada5hi/eslint-config` (previous) | `^64.0.0` | 147 rules total; 10 enabled |

## Rule renames / removals to watch

Unknown rule ids are a **hard ESLint error** for consumers, so every major bump needs a rename audit.

| Old rule | Status in v73 | Replacement |
|----------|---------------|-------------|
| `unicorn/no-instanceof-array` | Deprecated | `unicorn/no-instanceof-builtins` (covers more built-ins) |

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
| `prefer-regexp-escape`, `prefer-error-is-error`, `prefer-promise-try`, `prefer-temporal`, `prefer-uint8array-base64`, `prefer-get-or-insert-computed` | Suggest APIs newer than the Node 22 baseline |
| `operator-assignment`, `no-useless-concat`, `no-useless-else`, `no-unnecessary-nested-ternary` | Duplicate core rules already set in `src/configs/javascript/module.ts` |
| `logical-assignment-operators` | Duplicates the core ESLint rule of the same name |
| `name-replacements`, `consistent-boolean-name`, `consistent-compound-words`, `consistent-class-member-order` | Opinionated naming/layout, high noise |
| `no-barrel-files` | Conflicts with this repo's barrel-file (`index.ts`) convention |
| `no-top-level-side-effects`, `prefer-smaller-scope`, `max-nested-calls`, `try-complexity`, `id-match` | Noisy in config-style and library code |
| `prefer-private-class-fields`, `no-undeclared-class-members` | Overlap with TypeScript language features |
| `no-invalid-argument-count` | TypeScript compiler already covers this |
