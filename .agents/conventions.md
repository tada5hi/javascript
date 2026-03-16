# Conventions

## Tooling

| Tool | Purpose |
|------|---------|
| npm workspaces | Monorepo package management |
| Husky | Git hooks (commit-msg) |
| commitlint | Conventional commit message enforcement |
| release-please | Automated versioning and changelog generation |
| workspaces-publish | npm publishing for all packages |
| vitest | Unit testing for ESLint config packages |

## ESLint Config Architecture

The ESLint configs are built from composable building blocks rather than extending a single opinionated preset:

| Layer | Package | Purpose |
|-------|---------|---------|
| Core rules | `@eslint/js` | ESLint recommended rules (error prevention) |
| Formatting | `@stylistic/eslint-plugin` | Indent, quotes, max-len, operator-linebreak, spaced-comment |
| Imports | `eslint-plugin-import-x` | Import ordering, cycle detection, extraneous deps |
| Modern JS | `eslint-plugin-unicorn` | Prefer node: protocol, Array.isArray, includes, for-of, etc. |
| TypeScript | `typescript-eslint` | TS parser, recommended rules, type-aware rules (optional) |
| Vue | `eslint-plugin-vue` | Vue SFC linting via flat/recommended |

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
| `import-x/no-relative-packages` | Sometimes necessary during monorepo development |

## Coding Style

These are the defaults enforced by the packages in this repo:

- **Indentation**: 4 spaces
- **Quotes**: Single quotes
- **Max line length**: 150 characters (ESLint), 100 characters (Prettier)
- **Trailing commas**: Always
- **Semicolons**: Always
- **Module format**: ESM (`export default`) for ESLint config packages; CJS for Prettier/commitlint configs
- **Arrow functions**: Implicit return when possible (`arrow-body-style: as-needed`)
- **Early returns**: Preferred over else blocks (`no-else-return`)
- **One class per file**: Enforced (`max-classes-per-file: 1`)

## Testing

ESLint config packages have unit tests using vitest:

```bash
npm test                       # run all tests
```

Tests verify:
- Config functions return valid flat config arrays
- Specific rules produce expected lint results (quotes, indent, no-var, eqeqeq, etc.)
- Plugin configurations are properly included (vue, typescript-eslint)
- Options (like `project`) are correctly applied

Test files live at `packages/<name>/test/unit/*.spec.ts` and use ESLint's `Linter` API directly.

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

Each config module is a folder with three files:
- `module.ts` — the main function (sync or async) returning `Linter.Config[]`
- `types.ts` — option interfaces for the module (can be empty if none)
- `index.ts` — barrel export re-exporting from `module.ts` and `types.ts`

Steps:
1. Create `packages/eslint-config/src/configs/<name>/` with `module.ts`, `types.ts`, and `index.ts`
2. Use dynamic `await import()` for optional dependencies (add them as optional peerDependencies + devDependencies)
3. Wire the module into the factory in `src/module.ts` with auto-detection via `isPackageExists()`
4. Re-export option types from `src/types.ts` if they are part of `FactoryOptions`
5. Add tests in `test/unit/<name>.spec.ts`
6. Run `npm test` to verify

## Best Practices

- Keep config packages minimal — they should only contain configuration, no runtime code
- Test configuration changes by consuming them in a downstream project before publishing
- When modifying base rules in `eslint-config`, consider the impact on all extending packages
- Maintain consistency with the existing rule philosophy: pragmatic defaults that reduce noise without being overly strict
- When adding new rules, prefer those that are auto-fixable
