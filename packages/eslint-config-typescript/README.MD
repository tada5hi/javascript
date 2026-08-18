<p align="center">
    <img src="https://raw.githubusercontent.com/tada5hi/javascript/HEAD/packages/eslint-config-typescript/assets/logo.svg" alt="@tada5hi/eslint-config-typescript" width="128" height="128" />
</p>

<h1 align="center">@tada5hi/eslint-config-typescript</h1>

<p align="center">
    <b>Deprecated — a thin wrapper over <a href="../eslint-config"><code>@tada5hi/eslint-config</code></a>.</b>
</p>
This package provides ESLint rules for TypeScript, including ECMAScript 6+.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
  - [Basic](#basic)
  - [Parser](#parser)
  - [Run](#run)
- [License](#license)

## Installation

```bash
npm install --save-dev @tada5hi/eslint-config-typescript
```

## Usage

To use this package ESLint needs to be configured properly.

### Basic

Add the following line to the ESLint config file:

```diff
extends: [
+ '@tada5hi/eslint-config-typescript'
]
```

### Parser

In the ESLint configuration file, set the `parserOptions.project` to the location of the project `tsconfig.json`.

For example:

```diff
{
  extends: [
    '@tada5hi/eslint-config-typescript'
  ],
+ parserOptions: {
+   project: './tsconfig.json'
+ }
}
```

### Run

Open a terminal to the root of your project, and run the following command:

```shell
eslint --ext .ts,.js
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
