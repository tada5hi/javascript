const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style');

// set tab size to 4 ;)
baseStyleRules['indent'][1] = 4;

// set line size to 150 ;)
baseStyleRules['max-len'][1] = 150;

module.exports = {
    extends:  [
        'airbnb-base'
    ],
    parserOptions:  {
        ecmaVersion:  2020,  // Allows for the parsing of modern ECMAScript features
        sourceType:  'module',  // Allows for the use of imports
    },
    rules:  {
        "quotes": ["error", "single"],
        "sort-imports": ["error", {
            "ignoreCase": false,
            "ignoreDeclarationSort": true,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }],

        "guard-for-in": "off",
        "sort-keys": "off",

        "indent": baseStyleRules['indent'],
        "import/prefer-default-export": "off",
        "import/no-unresolved": "off",

        "max-len": baseStyleRules['max-len'],

        "no-bitwise": "off",
        "no-await-in-loop": "off",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-unused-vars": "error",
    },
    settings: {
        "import/resolver": {
            "node": {
                extensions: ['.js', '.mjs']
            }
        }
    }
};
