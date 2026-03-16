import type { Linter } from 'eslint';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import eslintConfigTypescript from '@tada5hi/eslint-config-typescript';

interface Options {
    project?: string | boolean;
}

export default function eslintConfigVueTypescript(options: Options = {}): Linter.Config[] {
    return [
        ...eslintConfigTypescript(options),
        ...vue.configs['flat/recommended'] as Linter.Config[],
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
