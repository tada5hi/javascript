module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue',
        "@tada5hi/eslint-config-typescript"
    ],
    plugins: ['@typescript-eslint'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
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
