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
            plugins: { '@stylistic': stylistic },
            rules: {
                '@stylistic/indent': ['error', 4, {
                    SwitchCase: 1,
                    VariableDeclarator: 1,
                    outerIIFEBody: 1,
                    FunctionDeclaration: {
                        parameters: 1,
                        body: 1,
                    },
                    FunctionExpression: {
                        parameters: 1,
                        body: 1,
                    },
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
                '@stylistic/semi': ['error', 'always'],
                '@stylistic/comma-dangle': ['error', 'always-multiline'],
                '@stylistic/arrow-parens': ['error', 'always'],
                '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
                '@stylistic/space-before-blocks': ['error', 'always'],
                '@stylistic/space-infix-ops': ['error'],
                '@stylistic/semi-spacing': ['error', { before: false, after: true }],
                '@stylistic/comma-style': ['error', 'last'],
                '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
                '@stylistic/operator-linebreak': ['error', 'after', { overrides: { '=': 'none' } }],
                '@stylistic/comma-spacing': ['error', { before: false, after: true }],
                '@stylistic/object-curly-spacing': ['error', 'always'],
                '@stylistic/padded-blocks': ['error', 'never'],
                '@stylistic/object-curly-newline': ['error', {
                    ObjectExpression: {
                        multiline: true,
                        minProperties: 3,
                    },
                    ObjectPattern: {
                        multiline: true,
                        minProperties: 3,
                    },
                    TSTypeLiteral: {
                        consistent: true,
                        multiline: true,
                        minProperties: 3,
                    },
                    TSInterfaceBody: {
                        consistent: true,
                        multiline: true,
                        minProperties: 3,
                    },
                    TSEnumBody: {
                        consistent: true,
                        multiline: true,
                        minProperties: 3,
                    },
                }],
                '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
                '@stylistic/exp-list-style': ['error', {
                    overrides: {
                        ExportNamedDeclaration: { singleLine: { maxItems: 3 } },
                        ImportDeclaration: { singleLine: { maxItems: 3 } },
                    },
                }],
                '@stylistic/spaced-comment': ['error', 'always', {
                    line: {
                        exceptions: ['-', '+'],
                        markers: ['=', '!', '/'],
                    },
                    block: {
                        exceptions: ['-', '+'],
                        markers: ['=', '!', ':', '::'],
                        balanced: true,
                    },
                }],
            },
        },
    ];
}
