<p align="center">
    <img src="https://raw.githubusercontent.com/tada5hi/javascript/HEAD/packages/eslint-config/assets/logo.svg" alt="@tada5hi/eslint-config" width="128" height="128" />
</p>

<h1 align="center">@tada5hi/eslint-config</h1>

<p align="center">
    <b>Shared ESLint flat config for JavaScript projects, with optional TypeScript and Vue support.</b>
</p>

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
    - [Vue](#vue)
    - [Vue + TypeScript](#vue--typescript)
    - [Statement Spacing](#statement-spacing)
    - [Conventions](#conventions)
    - [Options](#options)
    - [User Overrides](#user-overrides)
- [Auto-Detection](#auto-detection)
- [License](#license)

## Installation

```bash
npm install --save-dev @tada5hi/eslint-config eslint
```

For TypeScript support, also install:

```bash
npm install --save-dev typescript-eslint typescript
```

For Vue support, also install:

```bash
npm install --save-dev eslint-plugin-vue
```

## Usage

Create an `eslint.config.js` (or `eslint.config.mjs`) in your project root.
The package exports an async factory function that returns an ESLint flat config array.

### JavaScript

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig();
```

### TypeScript

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig({
    typescript: true,
});
```

With type-aware linting:

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig({
    typescript: { project: './tsconfig.json' },
});
```

### Vue

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig({
    vue: true,
});
```

### Vue + TypeScript

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig({
    typescript: { project: './tsconfig.json' },
    vue: true,
});
```

### Statement Spacing

`@stylistic/padding-line-between-statements` requires blank lines before and after complete `if` chains,
loops (`for`, `for…in`, `for…of`, `while`, `do…while`), `try` chains, and `switch` statements,
at every nesting level. Every `return` also needs a blank line before it when another statement precedes it.
The rule is enabled by default and supports `eslint --fix`.

```js
const pending = load();

while (pending.length) {
    const item = pending.pop();

    if (!item) {
        continue;
    }

    process(item);
}

return result;
```

There is no extra blank line at the beginning or end of a block, between `} else {`, `} catch {`,
or `} finally {`, or solely between switch cases. Ordinary declarations and expressions can stay adjacent.
This does not introduce a separate spacing requirement before `break`, `continue`, or `throw`.
Disable or customize `@stylistic/padding-line-between-statements` through a user override if needed.

### Conventions

The naming and module-layout conventions shared by
[`init-agent-docs`](https://github.com/tada5hi/skills/tree/master/skills/init-agent-docs),
[Authup](https://github.com/authup/authup/blob/master/.agents/conventions.md), and
[PrivateAIM Hub](https://github.com/PrivateAIM/hub/blob/master/.agents/conventions.md) are enabled by default. They do not require type-aware linting.

| Rule | Enforcement | Scope |
|------|-------------|-------|
| `@tada5hi/no-collection-call-in-condition` | Extract collection operations from control-flow conditions into named variables | JavaScript, TypeScript, and Vue scripts; not Vue templates |
| `@typescript-eslint/naming-convention` | Interfaces use `I` followed by PascalCase; type aliases must not start with `I` followed by an uppercase letter | TypeScript source files (not `.d.ts`, `.d.mts`, `.d.cts`); Vue scripts when both TypeScript and Vue are enabled |
| `@tada5hi/type-declaration-location` | Exported interfaces and aliases are declared in `types.ts` (or the corresponding TS extension) | JavaScript and TypeScript files under `src/`; ambient declaration files are exempt |
| `@tada5hi/no-reexport-shims` | Re-export-from declarations belong in `index.*` barrels and target their own folder tree | JavaScript and TypeScript files under `src/` |
| `@tada5hi/no-root-barrel-import` | Internal relative imports must not go through the package's root `src/index.*` | JavaScript and TypeScript files under `src/` |

Collection operations (`map`, `filter`, `flatMap`, `some`, `every`, `find`, `findIndex`, `findLast`,
`findLastIndex`, `reduce`, `reduceRight`) must be extracted from `if` / `else if`, loop tests, and ternary
conditions into named variables. Simple checks such as `isValid(value)`, `includes`, or `has` remain allowed:

```js
const hasActiveItems = items.some(isActive);

if (hasActiveItems) {
    process(items);
}
```

Detection is syntax-based: a custom object's method with one of these names also matches. Deferred callback
bodies are not inspected. The rule has no autofix because moving an operation can change short-circuiting or
loop re-evaluation; preserve those semantics during manual extraction.

The conventions are part of the default config; there is no `conventions` option. Enabling these defaults is a
breaking lint-policy change: downstream projects may need to move exported types into `types.ts`, re-export them through
`index.ts`, adjust internal imports, or update interface/type names. Fix violations where practical, or disable only the
specific rule for an exception with a later user override:

```js
export default eslintConfig(
    { typescript: true },
    {
        rules: {
            '@tada5hi/no-root-barrel-import': 'off',
        },
    },
);
```

Declaration files are exempt from naming checks so global and third-party interface augmentation can retain
required names such as `Window`. Put augmentations in declaration files or apply a scoped naming-rule override
when augmenting inside a regular source file.

Names such as `Input` and `Identity` remain valid type aliases. Properties, variables, classes, enums,
and imports receive no additional casing restrictions. The existing `max-classes-per-file` rule
already enforces one class per file.

For example, split an exported contract from its implementation and expose it through a folder barrel:

```ts
// src/client/types.ts
export interface IClient { connect(): void }
export type ClientOptions = { endpoint: string };

// src/client/module.ts
import type { IClient } from './types.ts';
export class Client implements IClient {
    connect(): void {}
}

// src/client/index.ts
export { Client } from './module.ts';
export type { IClient, ClientOptions } from './types.ts';

// src/index.ts
export * from './client/index.ts';
```

Inside the package, import `./client/module.ts` or `./client/types.ts` rather than `./index.ts`.

The custom rules are also available independently through [`@tada5hi/eslint-plugin`](../eslint-plugin).
The standalone plugin preset remains available when consumers want to compose these rules explicitly:
`@tada5hi/eslint-plugin` exposes `configs.conventions`; this is separate from the default rules assembled by this
package. The module-layout checks are intentionally not applied to Vue SFCs, tests outside `src/`, or build configs.
They do not resolve TypeScript aliases, package exports, or the filesystem. Override individual rules using the
[user overrides](#user-overrides) argument when a package needs an exception.

**Not enforced:** interfaces being exclusively class-implemented contracts (Hub explicitly permits data
interfaces), behavior-vs-data semantics, dependency injection, type precision, or deciding when a concept
needs its own folder. These require architectural review rather than a reliable syntax-only lint check.
No global filename casing, enum casing, or member-ordering policy is inferred from these sources.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typescript` | `boolean \| TypeScriptOptions` | auto-detect | Enable TypeScript rules. Pass `{ project: './tsconfig.json' }` for type-aware linting, or `{ project: true }` for `projectService`. |
| `vue` | `boolean \| VueOptions` | auto-detect | Enable Vue rules. When TypeScript is also enabled, the TS parser is automatically configured for `.vue` files. |

The public option type names `FactoryOptions`, `TypeScriptOptions`, and `VueOptions` are unchanged, but are now type
aliases rather than interfaces. They remain importable from the package entry point; declaration merging into these
types is no longer supported.

### User Overrides

Additional flat config objects can be passed as variadic arguments after the options:

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig(
    { typescript: true },
    {
        rules: {
            'no-console': 'off',
        },
    },
    {
        ignores: ['dist/**'],
    },
);
```

## Auto-Detection

When `typescript` or `vue` options are not explicitly set, the factory auto-detects whether to enable them by checking if the `typescript` or `vue` packages are installed. This means in most cases you can simply use:

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig();
```

## What's Included

The config always includes these rule sets:

- **JavaScript** - `@eslint/js` recommended + best-practice rules, ES6+ enforcement
- **Stylistic** - `@stylistic/eslint-plugin` for indent (4 spaces), quotes (single), max line length (150)
- **Imports** - `eslint-plugin-import-x` for import ordering, cycle detection, and more
- **Unicorn** - `eslint-plugin-unicorn` for modern JS patterns (node: protocol, Array.isArray, etc.)

Conditionally adds:

- **TypeScript** - `typescript-eslint` recommended rules, base-rule swaps, type-aware rules
- **Vue** - `eslint-plugin-vue` flat/recommended, html-indent (4 spaces), TS parser for `.vue` files

## License

Made with 💚

Published under [MIT License](./LICENSE).
