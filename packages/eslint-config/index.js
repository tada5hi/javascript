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
        "sort-keys": ["error", "asc", {
            "caseSensitive": true, "minKeys": 2, "natural": false
        }],

        "no-bitwise": "off",
        "import/prefer-default-export": "off",
    },
    settings: {
        "import/resolver": {
            "node": {
                extensions: ['.js', '.mjs']
            }
        }
    }
};
