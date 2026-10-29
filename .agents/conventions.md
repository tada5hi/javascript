# Conventions

## Tooling

| Tool | Purpose |
|------|---------|
| npm workspaces | Monorepo package management |
| nx | Build/test orchestration with caching (`run-many`, `dependsOn: ^build`) |
| tsdown | Bundling every package except `tsconfig` (`src/index.ts` -> `dist/index.mjs`) |
| Husky | Git hooks (commit-msg) |
| commitlint | Conventional commit message enforcement |
| release-please | Automated versioning and changelog generation |
| monoship | npm publishing for all packages |
| vitest | Unit testing for ESLint config packages |

## ESLint Config Architecture

The ESLint configs are built from composable building blocks rather than extending a single opinionated preset:

| Layer | Package | Purpose |
|-------|---------|---------|
| Core rules | `@eslint/js` | ESLint recommended rules (error prevention) |
| Formatting | `@stylistic/eslint-plugin` | Indent, quotes, max-len, operator-linebreak, spaced-comment |
| Imports | `eslint-plugin-import-lite` | Import ordering, no duplicates, no mutable exports |
| Modern JS | `eslint-plugin-unicorn` | Modern built-ins, likely-bug detection, redundant-code cleanup — see [Unicorn Rule Set](#unicorn-rule-set) |
| TypeScript | `typescript-eslint` | TS parser, recommended rules, type-aware rules (optional) |
| Vue | `eslint-plugin-vue` | Vue SFC linting via flat/recommended |

### Project Conventions

The convention rules are part of the default `eslintConfig` layer after TypeScript/Vue and before user overrides.
They compose `@typescript-eslint/naming-convention` (interface `I` prefixes, no interface-style alias names) with
`@tada5hi/eslint-plugin` (collection-free conditions, exported type locations, barrel ownership, and no internal imports through `src/index.*`).
Naming covers TypeScript and enabled Vue scripts; layout covers JavaScript and TypeScript under `src/` only. Consumers
can disable individual rules with a later user override; there is no conventions boolean. See the config and plugin
READMEs for exemptions and the standalone preset distinction.

Treat newly enabled or stricter defaults as breaking lint-policy changes: downstream projects must migrate affected
source or use explicit per-rule overrides. Do not keep a feature flag solely to avoid downstream migrations. Public
`FactoryOptions`, `TypeScriptOptions`, and `VueOptions` names remain stable as type aliases; declaration merging is no
longer supported. Put exported option declarations in `types.ts` and public re-exports in `index.ts`.

The policy is inferred from `tada5hi/skills`' init-agent-docs template and Authup/PrivateAIM Hub conventions.
Do not infer class-only interface semantics: Hub explicitly permits data interfaces. Do not add generic
filename casing, enum casing, or member-order rules without explicit evidence. Custom rules should be
syntax-only, avoid unsafe fixes, and have valid/invalid tests including path edge cases.

### Rule Philosophy

- **Pragmatic defaults**: Rules are enabled because they catch real bugs or enforce modern patterns, not because they exist
- **Minimal noise**: Rules that produce excessive false positives in TypeScript codebases are disabled (e.g., `class-methods-use-this`, `no-shadow`, `no-use-before-define`)
- **Auto-fixable preferred**: Most enabled rules can be resolved with `eslint --fix`
- **TypeScript-aware**: Base rules with TS equivalents are swapped in the TypeScript config (`default-param-last`, `no-empty-function`, `no-unused-expressions`, `return-await`)

### Key Disabled Rules (baked into config)

These are disabled in the base config because all downstream projects consistently override them:

| Rule | Why disabled |
|------|-------------|
| `class-methods-use-this` | Too noisy with TS abstract classes, decorators, DI |
| `no-shadow` | False positives with enums, type imports, callback params |
| `no-underscore-dangle` | Conflicts with private/internal naming conventions |
| `no-use-before-define` | TS compiler handles this; conflicts with "public API first" file organization |


### Unicorn Rule Set

`eslint-plugin-unicorn` ships 300+ rules. The config **opts in explicitly** rather than extending
`unicorn/recommended`, so every enabled rule is a deliberate choice. Rules live in
`packages/eslint-config/src/configs/unicorn/module.ts`, grouped by intent:

| Group | Intent | Examples |
|-------|--------|----------|
| Modern built-ins | Prefer current stdlib over legacy idioms | `prefer-node-protocol`, `prefer-string-repeat`, `prefer-math-abs`, `prefer-number-coercion` |
| Collections & iteration | Prefer the precise collection API | `prefer-includes`, `prefer-set-methods`, `prefer-group-by`, `no-for-loop` |
| Async & URL | Prefer modern async/URL primitives | `prefer-promise-with-resolvers`, `prefer-queue-microtask`, `prefer-url-can-parse` |
| Likely bugs | Catch real defects, not style | `no-accidental-bitwise-operator`, `no-array-fill-with-reference-type`, `require-array-sort-compare` |
| Redundant code | Remove no-op / dead constructs | `no-useless-coercion`, `no-unnecessary-boolean-comparison`, `prefer-early-return` |
| DOM | Inert outside browser code, useful for Vue | `no-incorrect-query-selector`, `require-css-escape`, `no-invalid-dom-token` |
| Literals & formatting | Readable escapes, no invisible characters | `prefer-short-escape-sequences`, `prefer-literal-ascii`, `no-leading-empty-lines` |

Selection criteria for adding a unicorn rule:

- **Node baseline is 24.3**, declared as `engines.node` on the package. Do not enable rules that suggest APIs newer than
  Node 24 — e.g. `prefer-temporal` (`Temporal`) and `prefer-get-or-insert-computed` are deliberately **excluded**.
  The documented exceptions are `prefer-uint8array-base64`, `prefer-uint8array-hex` and `prefer-iterator-zip`, which
  are enabled on purpose — see the [reference](references/eslint-plugin-unicorn.md).
- **`engines` constrains Node only.** Several enabled rules (`prefer-group-by`, `prefer-promise-with-resolvers`,
  `prefer-array-from-async`, `prefer-iterator-to-array`, `prefer-set-methods`) suggest APIs that reached browsers around
  2024. Vue consumers targeting older browsers need a polyfill or a local override for those rules.
- **Never enable a rule that contradicts an enabled core rule.** `prefer-number-coercion` was removed for this reason:
  the core `radix` rule requires `parseInt(x, 10)`, which that rule then flags — and `Number()` is not a semantic
  equivalent (`parseInt('12px', 10)` is `12`, `Number('12px')` is `NaN`).
- **Verify against idiomatic correct code, not just violating code.** `require-array-sort-compare` was removed after it
  flagged `['b', 'a'].sort()`, which is correct for strings; its schema is empty, so the noise cannot be tuned away.
- **No duplicates of core rules.** The `javascript` module already sets `operator-assignment`, `no-useless-concat`,
  `no-else-return` and `no-nested-ternary`, so the unicorn equivalents are excluded.
- **No additional Unicorn naming/layout policies.** `name-replacements`, `consistent-boolean-name`, `consistent-class-member-order`
  and `no-barrel-files` are excluded — the last one conflicts with the default barrel-ownership convention.

When bumping the plugin across majors, check for renamed/removed rules — an unknown rule id is a hard ESLint error for
consumers. `test/unit/unicorn.spec.ts` guards this by asserting every configured rule exists and none is deprecated.

## Coding Style

These are the defaults enforced by the packages in this repo:

- **Indentation**: 4 spaces
- **Quotes**: Single quotes
- **Max line length**: 150 characters (ESLint), 100 characters (Prettier)
- **Trailing commas**: Always
- **Semicolons**: Always
- **Module format**: ESM (`export default`) for ESLint config packages; CJS for Prettier/commitlint configs
- **Arrow functions**: Implicit return when possible (`arrow-body-style: as-needed`)
- **Readable conditions**: Extract `map`/`filter`/`flatMap`/`some`/`every`/`find`/`findIndex`/`findLast`/`findLastIndex`/`reduce`/`reduceRight` calls into named variables before `if`, loop tests, and ternary conditions. Syntax-only `@tada5hi/no-collection-call-in-condition` allows simple predicates and `includes`/`has`, skips deferred function bodies, and provides no unsafe autofix.
- **Class property spacing**: Require a blank line after each class property when another class member follows, including decorated, static, private, abstract, auto-accessor, and single-line properties. Keep decorators attached; no trailing block padding or method-to-method spacing requirement. Enforced and autofixed by `@tada5hi/lines-between-class-members` (`prev: 'field'`, `next: '*'`).
- **Statement spacing**: Blank lines before/after `if` chains, `for`/`for…in`/`for…of`, `while`, `do…while`, `try` chains, and `switch` at every nesting level; blank line before every `return`. No padding at block edges or between connected `else`/`catch`/`finally` branches. Enforced and autofixed by `@stylistic/padding-line-between-statements`.
- **Early returns**: Preferred over else blocks (`no-else-return`)
- **One class per file**: Enforced (`max-classes-per-file: 1`)

## Testing

The ESLint config packages and custom plugin have vitest unit tests at `packages/<name>/test/unit/*.spec.ts`, asserting against ESLint's
`Linter` API. See **[Testing](testing.md)** for the full setup, commands and patterns.

```bash
npm run build && npm test      # build first — the repo consumes its own dist/
```

Tests verify:
- Config functions return valid flat config arrays
- Specific rules produce expected lint results (quotes, indent, no-var, eqeqeq, etc.)
- Every configured plugin rule id exists upstream and is not deprecated
- Plugin configurations are properly included (vue, typescript-eslint)
- Options (like `project`) are correctly applied

## Commit Messages

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced by commitlint via a Husky `commit-msg` hook.

Common prefixes:
- `feat:` — new feature or package
- `fix:` — bug fix
- `fix(deps):` — dependency update
- `chore:` — maintenance tasks
- `docs:` — documentation changes

Body and footer line length limits are disabled.

## Release Process

- **release-please** manages versioning across all packages
- Each package is configured in `release-please-config.json`
- Versions are tracked in `.release-please-manifest.json`
- All packages use public npm publishing
- Changelogs are auto-generated per package

## Adding ESLint Config Modules

New ESLint rule sets should be added as config modules inside `packages/eslint-config/src/configs/`:

Each config module is a folder with these files:
- `module.ts` — the main function (sync or async) returning `Linter.Config[]`
- `types.ts` — option declarations for the module (omit if none)
- `index.ts` — barrel export re-exporting from `module.ts`, and from `types.ts` when present

Steps:
1. Create `packages/eslint-config/src/configs/<name>/` with `module.ts` and `index.ts`, plus `types.ts` when the module declares options
2. Use dynamic `await import()` for optional dependencies (add them as optional peerDependencies + devDependencies)
3. Wire the module into `src/module.ts`; use auto-detection only for optional integrations, not default convention rules
4. Re-export public option types from `src/index.ts` (not `src/types.ts`); retain existing public type names
5. Add tests in `test/unit/<name>.spec.ts`
6. Run `npm test` to verify

## References

External project references live in `.agents/references/`. When looking up source code in a referenced project,
update the corresponding reference file with the external path/symbol, the corresponding place in this repo, and any
behavioural differences — so future work can skip the re-search.

| Reference | Covers |
|-----------|--------|
| [eslint-plugin-unicorn](references/eslint-plugin-unicorn.md) | Rule inventory, enabled/excluded decisions, deprecations and rename history |
| [project-conventions](references/project-conventions.md) | Shared skill/Authup/Hub policies, lint mapping, intentional exclusions |

## Best Practices

- Keep config packages minimal — they should only contain configuration, no runtime code
- Test configuration changes by consuming them in a downstream project before publishing
- When modifying base rules in `eslint-config`, consider the impact on all extending packages
- Maintain consistency with the existing rule philosophy: pragmatic defaults that reduce noise without being overly strict
- When adding new rules, prefer those that are auto-fixable
