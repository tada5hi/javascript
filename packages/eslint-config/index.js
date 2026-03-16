import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importXPlugin from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default function eslintConfig() {
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
            plugins: {
                '@stylistic': stylistic,
                'import-x': importXPlugin,
                unicorn,
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
                'no-restricted-exports': ['error', { restrictedNamedExports: ['default', 'then'] }],

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

                // ----------------------------------------
                // Stylistic (formatting)
                // ----------------------------------------
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

                // ----------------------------------------
                // Import
                // ----------------------------------------
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

                // ----------------------------------------
                // Sort
                // ----------------------------------------
                'sort-imports': ['error', {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                }],
                'sort-keys': 'off',

                // ----------------------------------------
                // Unicorn (selected modern JS rules)
                // ----------------------------------------
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
