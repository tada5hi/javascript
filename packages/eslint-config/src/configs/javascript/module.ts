/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import js from '@eslint/js';
import globals from 'globals';

export function javascript(): Linter.Config[] {
    return [
        js.configs.recommended,
        {
            languageOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                globals: {
                    ...globals.node,
                    ...globals.es2021,
                },
            },
            rules: {
                // ----------------------------------------
                // Best practices
                // ----------------------------------------
                'array-callback-return': ['error', { allowImplicit: true }],
                'arrow-body-style': ['error', 'as-needed'],
                'consistent-return': 'error',
                'curly': ['error', 'multi-line'],
                'default-case': 'off',
                'default-case-last': 'error',
                'default-param-last': 'error',
                'dot-notation': ['error', { allowKeywords: true }],
                'eqeqeq': ['error', 'always', { null: 'ignore' }],
                'grouped-accessor-pairs': 'error',
                'guard-for-in': 'off',
                'max-classes-per-file': ['error', 1],
                'no-alert': 'warn',
                'no-await-in-loop': 'off',
                'no-bitwise': 'off',
                'no-caller': 'error',
                'no-console': 'warn',
                'no-constructor-return': 'error',
                'no-continue': 'off',
                'no-else-return': ['error', { allowElseIf: false }],
                'no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
                'no-eval': 'error',
                'no-extend-native': 'error',
                'no-extra-bind': 'error',
                'no-extra-label': 'error',
                'no-implied-eval': 'error',
                'no-iterator': 'error',
                'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
                'no-lone-blocks': 'error',
                'no-multi-str': 'error',
                'no-new': 'error',
                'no-new-func': 'error',
                'no-new-wrappers': 'error',
                'no-octal-escape': 'error',
                'no-param-reassign': 'off',
                'no-plusplus': 'off',
                'no-promise-executor-return': 'error',
                'no-proto': 'error',
                'no-restricted-exports': ['error', { restrictedNamedExports: ['default', 'then'] }],
                'no-restricted-globals': ['error',
                    { name: 'isFinite', message: 'Use Number.isFinite instead.' },
                    { name: 'isNaN', message: 'Use Number.isNaN instead.' },
                ],
                'no-restricted-properties': ['error',
                    { object: 'arguments', property: 'callee', message: 'arguments.callee is deprecated.' },
                    { object: 'global', property: 'isFinite', message: 'Use Number.isFinite instead.' },
                    { object: 'self', property: 'isFinite', message: 'Use Number.isFinite instead.' },
                    { object: 'window', property: 'isFinite', message: 'Use Number.isFinite instead.' },
                    { object: 'global', property: 'isNaN', message: 'Use Number.isNaN instead.' },
                    { object: 'self', property: 'isNaN', message: 'Use Number.isNaN instead.' },
                    { object: 'window', property: 'isNaN', message: 'Use Number.isNaN instead.' },
                    { property: '__defineGetter__', message: 'Use Object.defineProperty instead.' },
                    { property: '__defineSetter__', message: 'Use Object.defineProperty instead.' },
                    { object: 'Math', property: 'pow', message: 'Use the ** operator instead.' },
                ],
                'no-return-assign': ['error', 'always'],
                'no-script-url': 'error',
                'no-self-compare': 'error',
                'no-sequences': 'error',
                'no-throw-literal': 'error',
                'no-unreachable-loop': 'error',
                'no-unused-expressions': ['error', {
                    allowShortCircuit: false,
                    allowTernary: false,
                    allowTaggedTemplates: false,
                }],
                'no-useless-concat': 'error',
                'no-useless-return': 'error',
                'prefer-destructuring': ['error', {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                }],
                'prefer-numeric-literals': 'error',
                'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
                'radix': 'error',
                'yoda': 'error',

                // ----------------------------------------
                // ES6+
                // ----------------------------------------
                'no-useless-computed-key': 'error',
                'no-useless-constructor': 'error',
                'no-useless-rename': 'error',
                'no-var': 'error',
                'object-shorthand': ['error', 'always'],
                'prefer-arrow-callback': 'error',
                'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
                'prefer-object-spread': 'error',
                'prefer-rest-params': 'error',
                'prefer-spread': 'error',
                'prefer-template': 'error',
                'symbol-description': 'error',

                // ----------------------------------------
                // Variables
                // ----------------------------------------
                'no-shadow': 'off',
                'no-use-before-define': 'off',

                // ----------------------------------------
                // Style (semantic)
                // ----------------------------------------
                'class-methods-use-this': 'off',
                'new-cap': ['error', { newIsCap: true, capIsNew: false }],
                'no-lonely-if': 'error',
                'no-nested-ternary': 'error',
                'no-underscore-dangle': 'off',
                'no-unneeded-ternary': ['error', { defaultAssignment: false }],
                'one-var': ['error', 'never'],
                'operator-assignment': ['error', 'always'],
            },
        },
    ];
}
