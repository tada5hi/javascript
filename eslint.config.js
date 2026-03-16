import eslintConfig from '@tada5hi/eslint-config';

export default eslintConfig(
    { typescript: true },
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/CHANGELOG.md',
        ],
    },
    {
        rules: {
            'import-x/no-extraneous-dependencies': 'off',
        },
    },
);
