# Testing

## Setup

- **Runner**: vitest 4
- **Test location**: `packages/<name>/test/unit/*.spec.ts`
- **Config**: `packages/<name>/test/vitest.config.ts` (per package — there is no shared root config in use)
- **Prerequisite**: `npm run build`. The nx `test` target declares `dependsOn: ["^build"]` because the deprecated
  wrapper packages import `@tada5hi/eslint-config` through the workspace symlink, which resolves to `dist/`.

Only the four ESLint packages have tests. `prettier-config`, `commitlint-config`, `semantic-release` and `tsconfig`
export plain configuration objects and have no `test` script.

| Package | Spec files |
|---------|-----------|
| `eslint-config` | `index`, `javascript`, `imports`, `unicorn`, `typescript`, `vue` |
| `eslint-config-typescript` | `index` |
| `eslint-config-vue` | `index` |
| `eslint-config-vue-typescript` | `index` |

## Running Tests

```bash
npm test                                              # all packages, via nx (cached)
npm test --workspace=packages/eslint-config           # one package
npx nx run @tada5hi/eslint-config:test                # one package, via nx directly

cd packages/eslint-config
npx vitest run -c test/vitest.config.ts               # direct
npx vitest run -c test/vitest.config.ts -t 'unicorn'  # filter by test name
```

**Run vitest from the package directory, not the repo root.** The `include` glob in each
`test/vitest.config.ts` is relative to that package, so `npx vitest run -c packages/<name>/test/vitest.config.ts`
from the root reports *"No test files found"* rather than failing loudly.

> The root `vitest.config.js` includes `packages/*/test/**/*.spec.js` — a `.js` glob that matches none of the
> `.spec.ts` files. It is effectively dead; tests run through nx and the per-package configs.

## Test Layers

### Unit Tests

There is one layer. Tests are pure in-process assertions against the generated flat config — no fixtures on disk, no
child processes, no network. Two complementary styles:

**1. Rule behaviour** — assert that linting a snippet produces (or does not produce) a given `ruleId`:

```typescript
const config = await eslintConfig({ typescript: false, vue: false });
const messages = linter.verify('const x = "hello";\n', config, { filename: 'test.js' });

expect(messages.find((m) => m.ruleId === '@stylistic/quotes')).toBeDefined();
```

Use ESLint's `Linter` API (`new Linter()`), not the `ESLint` class — it needs no filesystem and stays fast.
Pass the `filename` that matches the config you are exercising (`test.js`, `test.ts`, `test.vue`).

**2. Config integrity** — assert properties of the config array itself rather than lint output. `unicorn.spec.ts`
walks every configured `unicorn/*` rule id and asserts it exists in the installed plugin and is not deprecated:

```typescript
const unknown = names.filter((name) => !unicornPlugin.rules[name.replace('unicorn/', '')]);
expect(unknown).toEqual([]);
```

This guard matters because an unknown rule id is a **hard ESLint error for consumers**, and upstream plugins rename
rules across majors. Add an equivalent guard when introducing a config module for a fast-moving plugin.

## Testing Philosophy

Tests should assert *expected* behavior based on the documented rule philosophy — not merely confirm what the config
currently emits. If a test fails after a dependency bump, it may have caught a real upstream rename or default change
rather than a test error.

- **Assert on `ruleId`, not message text.** Upstream wording changes between minor versions.
- **One rule per test.** Keeps failures diagnosable when a plugin changes several rules at once.
- **Disable unrelated integrations.** Pass `{ typescript: false, vue: false }` so a JS test is not affected by
  auto-detection picking up `typescript` from the repo's own `node_modules`.

## Code Coverage

Coverage is not configured — there is no coverage provider dependency and no `coverage` script. Add
`@vitest/coverage-v8` and a `coverage` block to the package's `test/vitest.config.ts` if it becomes necessary.

## CI Pipeline

GitHub Actions (`.github/workflows/main.yml`) runs on pushes to `master` and on PR open/synchronize, with Node 22:

```
install (checkout + ./.github/actions/install)
    └── build (./.github/actions/build)
            └── tests (npm test)
```

**CI does not run `npm run lint`.** Run it locally before pushing — and run `npm run build` first, since the repo lints
itself with its own freshly built config.

## Writing New Tests

1. Place the file in `packages/<name>/test/unit/` with a `.spec.ts` extension — it is picked up automatically.
2. Import the factory from source (`../../src/index.ts`), not from `dist/`, so tests cover current source.
3. Add a rule-behaviour test for each newly enabled rule, and a config-integrity guard for new plugin modules.
4. Run `npm test` to verify.
