/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import unicornPlugin from 'eslint-plugin-unicorn';

export function unicorn(): Linter.Config[] {
    return [
        {
            plugins: { unicorn: unicornPlugin },
            rules: {
                'unicorn/prefer-node-protocol': 'error',
                'unicorn/no-instanceof-array': 'error',
                'unicorn/prefer-number-properties': 'error',
                'unicorn/prefer-string-starts-ends-with': 'error',
                'unicorn/prefer-string-trim-start-end': 'error',
                'unicorn/prefer-array-flat': 'error',
                'unicorn/prefer-array-flat-map': 'error',
                'unicorn/prefer-includes': 'error',
                'unicorn/no-for-loop': 'error',
                'unicorn/prefer-optional-catch-binding': 'error',
            },
        },
    ];
}
