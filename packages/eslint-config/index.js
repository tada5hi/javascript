const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style');

// set tab size to 4 ;)
baseStyleRules['indent'][1] = 4;

module.exports = {
    extends:  [
        'airbnb-base'
    ],
    parserOptions:  {
        ecmaVersion:  2020,  // Allows for the parsing of modern ECMAScript features
        sourceType:  'module',  // Allows for the use of imports
    },
    rules:  {
        "no-unused-vars": "error",
        "quotes": ["error", "single"],
        "sort-imports": ["error", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }],

        "indent": baseStyleRules['indent'],
        "no-bitwise": "off",
        "import/prefer-default-export": "off",
        "sort-keys": "off",
        "no-param-reassign": "off"
    },
    settings: {
        "import/resolver": {
            "node": {
                extensions: ['.js', '.mjs']
            }
        }
    }
};
