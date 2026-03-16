/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import importXPlugin from 'eslint-plugin-import-x';

export function imports(): Linter.Config[] {
    return [
        {
            plugins: {
                'import-x': importXPlugin,
            },
            rules: {
                'import-x/export': 'error',
                'import-x/extensions': ['error', 'ignorePackages', {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                    mjs: 'never',
                }],
                'import-x/first': 'error',
                'import-x/newline-after-import': 'error',
                'import-x/no-absolute-path': 'error',
                'import-x/no-cycle': 'error',
                'import-x/no-duplicates': 'error',
                'import-x/no-extraneous-dependencies': ['error', {
                    devDependencies: [
                        '**/test/**',
                        '**/tests/**',
                        '**/*.test.{js,ts}',
                        '**/*.spec.{js,ts}',
                        '**/vitest.config.*',
                        '**/vite.config.*',
                        '**/rollup.config.*',
                        '**/eslint.config.*',
                    ],
                    optionalDependencies: false,
                }],
                'import-x/no-mutable-exports': 'error',
                'import-x/no-relative-packages': 'off',
                'import-x/no-self-import': 'error',
                'import-x/no-useless-path-segments': 'error',
                'import-x/no-webpack-loader-syntax': 'error',
                'import-x/order': ['error', {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                }],
                'import-x/prefer-default-export': 'off',
                'import-x/no-unresolved': 'off',

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
