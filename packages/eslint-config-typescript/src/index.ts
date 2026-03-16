import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import eslintConfig from '@tada5hi/eslint-config';

interface Options {
    project?: string | boolean;
}

export default function eslintConfigTypescript(options: Options = {}): Linter.Config[] {
    const { project } = options;

    const configs: Linter.Config[] = [
        ...eslintConfig(),
        ...tseslint.configs.recommended as Linter.Config[],
    ];

    if (project) {
        configs.push({
            languageOptions: {
                parserOptions: {
                    projectService: project === true ? true : undefined,
                    project: project !== true ? project : undefined,
                },
            },
            rules: {
                'no-return-await': 'off',
                '@typescript-eslint/return-await': ['error', 'in-try-catch'],
            },
        });
    }

    configs.push({
        rules: {
            // ----------------------------------------
            // Disable base rules in favor of TS versions
            // ----------------------------------------
            'default-param-last': 'off',
            '@typescript-eslint/default-param-last': 'error',

            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': ['error', {
                allow: ['arrowFunctions', 'functions', 'methods'],
            }],

            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': ['error', {
                allowShortCircuit: false,
                allowTernary: false,
                allowTaggedTemplates: false,
            }],

            'no-shadow': 'off',
            'no-useless-constructor': 'off',

            // ----------------------------------------
            // TS-specific rules
            // ----------------------------------------
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-shadow': 'off',
        },
    });

    return configs;
}
