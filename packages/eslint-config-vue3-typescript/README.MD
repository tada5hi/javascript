# @tada5hi/eslint-config-vue3-typescript 📚
This package provides ESLint rules for TypeScript, including Vue.js 3+ & ECMAScript 6+.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Basic](#basic)
  - [Parser](#parser)
  - [Run](#run)
- [License](#license)

## Installation

```bash
npm install --save-dev @tada5hi/eslint-config-vue3-typescript
```

## Usage

To use this package ESLint needs to be configured properly.

### Basic

Add the following line to the ESLint config file:

```diff
extends: [
+ '@tada5hi/eslint-config-vue3-typescript'
]
```

### Parser

In the ESLint configuration file, set the `parserOptions.project` to the location of the project `tsconfig.json`.

For example:

```diff
{
  extends: [
    '@tada5hi/eslint-config-vue3-typescript'
  ],
+ parserOptions: {
+   project: './tsconfig.json'
+ }
}
```

### Run

Open a terminal to the root of your project, and run the following command:

```shell
eslint --ext .ts,.js,.vue
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
