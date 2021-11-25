module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue',
        '@tada5hi/eslint-config-typescript'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
};
