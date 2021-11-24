module.exports =  {
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
        "sort-keys": ["error", "asc", {
            "caseSensitive": true, "minKeys": 2, "natural": false
        }],
        "@typescript-eslint/no-explicit-any": "off"
    },
    settings: {
        "import/resolver": {
            "typescript": {}
        }
    }
};
