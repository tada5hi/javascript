module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue',
        "@tada5hi/eslint-config-typescript"
    ],
    parserOptions: {
        parser: {
            'js': 'espree',
            'jsx': 'espree',
            'ts': '@typescript-eslint/parser',
            'tsx': '@typescript-eslint/parser',
        },
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        "@typescript-eslint/no-this-alias": "off",

        "vue/multi-word-component-names": "off",
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/require-default-prop": "off"
    }
};
