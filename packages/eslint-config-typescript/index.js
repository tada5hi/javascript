const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style');

// set tab size to 4 ;)
baseStyleRules['indent'][1] = 4;

module.exports = {
    extends:  [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
    parserOptions:  {
        ecmaVersion:  2020,  // Allows for the parsing of modern ECMAScript features
        sourceType:  'module',  // Allows for the use of imports
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules:  {
        "no-unused-vars": "error",
        "quotes": ["error", "single"],
        "sort-imports": ["error", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }],

        "no-bitwise": "off",
        "import/prefer-default-export": "off",
        "no-param-reassign": "off",
        "sort-keys": "off",

        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/indent": baseStyleRules['indent'],
        "@typescript-eslint/object-curly-spacing": "off"
    },
    settings: {
        "import/resolver": {
            "typescript": {}
        }
    }
};
