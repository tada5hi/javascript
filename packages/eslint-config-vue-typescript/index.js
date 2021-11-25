module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue'
    ],
    plugins: ['@typescript-eslint'],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
};
