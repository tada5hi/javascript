# @tada5hi/eslint-config

Shared ESLint flat config for JavaScript projects, with optional TypeScript and Vue support.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
    - [Vue](#vue)
    - [Vue + TypeScript](#vue--typescript)
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

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typescript` | `boolean \| TypeScriptOptions` | auto-detect | Enable TypeScript rules. Pass `{ project: './tsconfig.json' }` for type-aware linting, or `{ project: true }` for `projectService`. |
| `vue` | `boolean \| VueOptions` | auto-detect | Enable Vue rules. When TypeScript is also enabled, the TS parser is automatically configured for `.vue` files. |

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
