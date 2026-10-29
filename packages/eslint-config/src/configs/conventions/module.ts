/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import tada5hi from '@tada5hi/eslint-plugin';

export function conventions(typescript: boolean, vue: boolean): Linter.Config[] {
    const configs: Linter.Config[] = [
        {
            name: 'tada5hi/conventions/readability',
            plugins: { '@tada5hi': tada5hi },
            rules: { '@tada5hi/no-collection-call-in-condition': 'error' },
        },
        {
            name: 'tada5hi/conventions/modules',
            files: ['**/src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
            rules: {
                '@tada5hi/type-declaration-location': 'error',
                '@tada5hi/no-reexport-shims': 'error',
                '@tada5hi/no-root-barrel-import': 'error',
            },
        },
    ];

    if (typescript) {
        configs.push({
            name: 'tada5hi/conventions/naming',
            ignores: ['**/*.d.{ts,mts,cts}'],
            files: [
                '**/*.{ts,tsx,mts,cts}',
                ...(vue ? ['**/*.vue'] : []),
            ],
            rules: {
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'interface',
                        format: ['PascalCase'],
                        prefix: ['I'],
                    },
                    {
                        selector: 'typeAlias',
                        format: null,
                        custom: { regex: '^I[A-Z]', match: false },
                    },
                ],
            },
        });
    }

    return configs;
}
