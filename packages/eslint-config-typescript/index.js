const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style');

// set tab size to 4 ;)
baseStyleRules['indent'][1] = 4;

module.exports = {
    extends:  [
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

        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/indent": baseStyleRules['indent'],
        "@typescript-eslint/object-curly-spacing": "off"
    },
    settings: {
        "import/parsers": {
            '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        "import/resolver": {
            "typescript": {}
        }
    }
};
