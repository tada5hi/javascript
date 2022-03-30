# @tada5hi/eslint-config-nuxt-typescript 📚
This package provides ESLint rules for TypeScript, including Nuxt.js & ECMAScript 6+.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Basic](#basic)
  - [Parser](#parser)
  - [Run](#run)

## Installation

```bash
npm install --save-dev @tada5hi/eslint-config-nuxt-typescript
```

## Usage

To use this package ESLint needs to be configured properly.

### Basic

Add the following line to the ESLint config file:

```diff
extends: [
+ '@tada5hi/eslint-config-nuxt-typescript'
]
```

### Parser

In the ESLint configuration file, set the `parserOptions.project` to the location of the project `tsconfig.json`.

For example:

```diff
{
  extends: [
    '@tada5hi/eslint-config-nuxt-typescript'
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
