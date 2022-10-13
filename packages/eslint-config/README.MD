# @tada5hi/eslint-config 📚
This package provides ESLint rules for JavaScript, including ECMAScript 6+.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [Basic](#basic)
    - [Run](#run)
- [License](#license)

## Installation

```bash
npm install --save-dev @tada5hi/eslint-config
```

## Usage

To use this package ESLint needs to be configured properly.

### Basic

Add the following line to the ESLint config file:

```diff
extends: [
+ '@tada5hi/eslint-config'
]
```

### Run

Open a terminal to the root of your project, and run the following command:

```shell
eslint --ext .js
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
