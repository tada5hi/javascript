# JavaScript - Shared Configurations

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This monorepo contains shared developer tool configurations published as npm packages under the `@tada5hi` scope.
It provides meaningful default ESLint rules, TypeScript compiler settings, Prettier formatting, commitlint conventions,
and semantic-release configuration.

**Table of Contents**

- [Packages](#packages)
- [Usage](#usage)
- [License](#license)

## Packages

| Package | Description |
|---------|-------------|
| [`@tada5hi/eslint-config`](packages/eslint-config) | ESLint flat config with optional TypeScript and Vue support |
| [`@tada5hi/prettier-config`](packages/prettier-config) | Prettier configuration |
| [`@tada5hi/tsconfig`](packages/tsconfig) | TypeScript compiler configuration |
| [`@tada5hi/commitlint-config`](packages/commitlint-config) | Commitlint configuration |
| [`@tada5hi/semantic-release`](packages/semantic-release) | Semantic-release configuration |

## Usage

### ESLint

Install the config package and ESLint:

```bash
npm install --save-dev eslint @tada5hi/eslint-config
```

Create an `eslint.config.js` in your project root:

```js
import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig();
```

TypeScript and Vue support are auto-detected based on installed packages. You can also enable them explicitly:

```js
// TypeScript with type-aware linting
export default eslintConfig({
    typescript: { project: './tsconfig.json' },
});

// Vue + TypeScript
export default eslintConfig({
    typescript: { project: './tsconfig.json' },
    vue: true,
});
```

Additional ESLint flat config objects can be passed as extra arguments:

```js
export default eslintConfig(
    { typescript: true },
    { rules: { 'no-console': 'off' } },
    { ignores: ['dist/**'] },
);
```

If an optional dependency like `typescript-eslint` or `eslint-plugin-vue` is missing when needed, it will be installed automatically.

### Prettier

```bash
npm install --save-dev prettier @tada5hi/prettier-config
```

In your `package.json`:

```json
{
    "prettier": "@tada5hi/prettier-config"
}
```

### TypeScript

```bash
npm install --save-dev typescript @tada5hi/tsconfig
```

In your `tsconfig.json`:

```json
{
    "extends": "@tada5hi/tsconfig"
}
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
