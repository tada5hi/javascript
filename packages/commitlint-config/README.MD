<p align="center">
    <img src="https://raw.githubusercontent.com/tada5hi/javascript/HEAD/packages/commitlint-config/assets/logo.svg" alt="@tada5hi/commitlint-config" width="128" height="128" />
</p>

<h1 align="center">@tada5hi/commitlint-config</h1>

<p align="center">
    <b>Shared commitlint configuration built on Conventional Commits.</b>
</p>
This package provides a shared commitlint config, which is based on
[@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional).

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```bash
npm install --save-dev @tada5hi/commitlint-config
```

## Usage

`commitlint-config.js`

```diff
{
+ extends: ['@tada5hi/commitlint-config']
}
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
