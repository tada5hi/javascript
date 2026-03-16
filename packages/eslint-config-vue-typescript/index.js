import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import eslintConfigTypescript from '@tada5hi/eslint-config-typescript';

export default function eslintConfigVueTypescript(options = {}) {
    return [
        ...eslintConfigTypescript(options),
        ...vue.configs['flat/recommended'],
        {
            files: ['**/*.vue'],
            languageOptions: {
                parserOptions: {
                    parser: tseslint.parser,
                    extraFileExtensions: ['.vue'],
                },
            },
        },
        {
            rules: {
                'vue/multi-word-component-names': 'off',
                'vue/html-indent': ['error', 4, {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true,
                    ignores: [],
                }],
                'vue/no-template-shadow': 'off',
                'vue/require-default-prop': 'off',
            },
        },
    ];
}
