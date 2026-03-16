/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import stylistic from '@stylistic/eslint-plugin';

export function stylisticConfig(): Linter.Config[] {
    return [
        {
            plugins: {
                '@stylistic': stylistic,
            },
            rules: {
                '@stylistic/indent': ['error', 4, {
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    outerIIFEBody: 1,
                    FunctionDeclaration: { parameters: 1, body: 1 },
                    FunctionExpression: { parameters: 1, body: 1 },
                    CallExpression: { arguments: 1 },
                    ArrayExpression: 1,
                    ObjectExpression: 1,
                    ImportDeclaration: 1,
                    flatTernaryExpressions: false,
                    ignoreComments: false,
                }],
                '@stylistic/max-len': ['error', 150, 2, {
                    ignoreUrls: true,
                    ignoreComments: false,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                }],
                '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
                '@stylistic/operator-linebreak': ['error', 'after', {
                    overrides: { '=': 'none' },
                }],
                '@stylistic/spaced-comment': ['error', 'always', {
                    line: { exceptions: ['-', '+'], markers: ['=', '!', '/'] },
                    block: { exceptions: ['-', '+'], markers: ['=', '!', ':', '::'], balanced: true },
                }],
            },
        },
    ];
}
