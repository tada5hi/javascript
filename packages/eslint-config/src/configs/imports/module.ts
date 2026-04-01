/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import importLitePlugin from 'eslint-plugin-import-lite';

export function imports(): Linter.Config[] {
    return [
        {
            plugins: { 'import': importLitePlugin },
            rules: {
                'import/first': 'error',
                'import/newline-after-import': 'error',
                'import/no-duplicates': 'error',
                'import/no-mutable-exports': 'error',

                'sort-imports': ['error', {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                }],
                'sort-keys': 'off',
            },
        },
    ];
}
