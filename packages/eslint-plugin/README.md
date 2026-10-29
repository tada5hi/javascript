# @tada5hi/eslint-plugin

Syntax-only ESLint rules for the `@tada5hi` source conventions.

## Usage

```bash
npm install --save-dev eslint typescript typescript-eslint @tada5hi/eslint-plugin
```

```js
import tada5hi from '@tada5hi/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        languageOptions: { parser: tseslint.parser },
    },
    tada5hi.configs.conventions,
];
```

The preset does not configure or depend on a TypeScript parser. Supply your own parser configuration, as above, or use your existing TypeScript ESLint config.

The preset applies the custom rules to `**/src/**/*.{ts,tsx,mts,cts}` (not Vue or build/test configuration files). For manual use, including plain JavaScript import rules with ESLint's default parser:

```js
import tada5hi from '@tada5hi/eslint-plugin';

export default [{
    plugins: { '@tada5hi': tada5hi },
    rules: {
        '@tada5hi/no-reexport-shims': 'error',
        '@tada5hi/no-root-barrel-import': 'error',
    },
}];
```

## Rules

- **`lines-between-class-members`** — autofixable Stylistic class-member spacing with support for TypeScript abstract
  properties and auto-accessors in its `field` selector. Accepts the same options as
  `@stylistic/lines-between-class-members`; the shared config and conventions preset require a blank line after
  fields only (`prev: 'field'`, `next: '*'`), leaving method-to-method spacing unchanged. Does not mutate the parser AST.

- **`no-collection-call-in-condition`** — extract collection operations into named variables rather than putting them
  in `if` / `else if`, `while`, `do…while`, `for` tests, or ternary conditions. Matches `map`, `filter`, `flatMap`,
  `some`, `every`, `find`, `findIndex`, `findLast`, `findLastIndex`, `reduce`, and `reduceRight` by method name,
  including chains, optional calls, and static computed method names. Simple predicates, `includes`, and `has`
  remain allowed. This syntax-only rule also matches unrelated methods with these names. Deferred function
  bodies (including IIFEs) and deferred instance-field initializers inside conditions are not inspected, nor are Vue template expressions. No autofix: preserve
  short-circuiting and loop re-evaluation when extracting a value.

```ts
const hasActiveItems = items.some(isActive);

if (hasActiveItems) {
    process(items);
}
```

- **`type-declaration-location`** — exported top-level interfaces and type aliases belong in `types.ts`, `types.mts`, `types.cts`, or `types.tsx`. This includes declarations exported later or by a default export. Private top-level types and local types are allowed. Ambient declaration files (`.d.ts`, `.d.mts`, `.d.cts`) are exempt. Namespace and module-local declarations are not top-level and are allowed; no interface-versus-alias semantics are enforced.
- **`no-reexport-shims`** — top-level export-from declarations are allowed only in `index` directory barrels, including `index.d.ts`, `index.d.mts`, and `index.d.cts`. Ambient module re-exports are not file barrels and are exempt. Their source must begin with `./` and normalize within that barrel directory's subtree. Named local exports are allowed.
- **`no-root-barrel-import`** — internal relative static imports, dynamic imports, unshadowed CommonJS `require()` calls, TypeScript import-equals declarations, and TypeScript import types may not target the nearest `src` root or its explicit `index` file. Nested and sibling barrels remain allowed. For Windows absolute filenames (drive-letter or UNC paths), CommonJS `require()` and TypeScript import-equals requests also recognize backslash separators; ESM and POSIX requests are unchanged.

The rules do not resolve files or use a TypeScript program. Only `lines-between-class-members` provides autofixes;
the other rules require manual changes. Filename-based checks are skipped when ESLint provides an unknown filename.

## Exceptions

Place overrides after `tada5hi.configs.conventions` (or after the shared config). Use the exact rule IDs to disable
individual policies, optionally adding `files` to limit an exception:

```js
{
    rules: {
        '@tada5hi/lines-between-class-members': 'off',
        '@tada5hi/no-collection-call-in-condition': 'off',
        '@tada5hi/type-declaration-location': 'off',
        '@tada5hi/no-reexport-shims': 'off',
        '@tada5hi/no-root-barrel-import': 'off',
    },
}
```
