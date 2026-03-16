/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import { ensurePackages } from '../../utils.ts';
import type { TypeScriptOptions } from './types.ts';

export async function typescript(options: TypeScriptOptions = {}): Promise<Linter.Config[]> {
    const { project } = options;

    await ensurePackages(['typescript-eslint']);

    const tseslint = await import('typescript-eslint');

    const configs: Linter.Config[] = [
        ...tseslint.default.configs.recommended as Linter.Config[],
    ];

    if (project) {
        configs.push({
            files: ['**/*.{ts,tsx,mts,cts}'],
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
        files: ['**/*.{ts,tsx,mts,cts}'],
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
