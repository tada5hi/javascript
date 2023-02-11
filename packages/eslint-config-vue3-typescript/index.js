module.exports = {
    extends:  [
        "plugin:vue/vue3-recommended",
        "@vue/typescript/recommended",
        '@tada5hi/eslint-config-typescript'
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
};
