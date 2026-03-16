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

### ESLint (Flat Config, ESLint >= 9)

| Package | Description |
|---------|-------------|
| [`@tada5hi/eslint-config`](packages/eslint-config) | Base ESLint flat config for JavaScript |
| [`@tada5hi/eslint-config-typescript`](packages/eslint-config-typescript) | TypeScript ESLint flat config |
| [`@tada5hi/eslint-config-vue`](packages/eslint-config-vue) | Vue.js ESLint flat config |
| [`@tada5hi/eslint-config-vue-typescript`](packages/eslint-config-vue-typescript) | Vue + TypeScript ESLint flat config |

### Other

| Package | Description |
|---------|-------------|
| [`@tada5hi/prettier-config`](packages/prettier-config) | Shared Prettier configuration |
| [`@tada5hi/tsconfig`](packages/tsconfig) | Shared TypeScript compiler configuration |
| [`@tada5hi/commitlint-config`](packages/commitlint-config) | Shared commitlint configuration |
| [`@tada5hi/semantic-release`](packages/semantic-release) | Shared semantic-release configuration |

## Usage

### ESLint

Install the desired config package and ESLint:

```bash
npm install --save-dev eslint @tada5hi/eslint-config-typescript
```

Create an `eslint.config.js` in your project root:

```js
import eslintConfig from '@tada5hi/eslint-config-typescript';

export default [
    ...eslintConfig({ project: './tsconfig.json' }),
];
```

For Vue + TypeScript projects:

```js
import eslintConfig from '@tada5hi/eslint-config-vue-typescript';

export default [
    ...eslintConfig({ project: './tsconfig.json' }),
];
```

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
