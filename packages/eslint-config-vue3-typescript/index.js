module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue3',
        '@tada5hi/eslint-config-typescript'
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
    parser: 'vue-eslint-parser',
};
