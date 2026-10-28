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
                // ----------------------------------------
                // Modern built-ins
                // ----------------------------------------
                'unicorn/prefer-node-protocol': 'error',
                'unicorn/prefer-number-properties': 'error',
                'unicorn/prefer-string-starts-ends-with': 'error',
                'unicorn/prefer-string-trim-start-end': 'error',
                'unicorn/prefer-string-repeat': 'error',
                'unicorn/prefer-string-pad-start-end': 'error',
                'unicorn/prefer-string-match-all': 'error',
                'unicorn/prefer-single-replace': 'error',
                'unicorn/prefer-global-number-constants': 'error',
                'unicorn/prefer-number-is-safe-integer': 'error',
                'unicorn/prefer-math-abs': 'error',
                'unicorn/prefer-math-constants': 'error',
                'unicorn/prefer-flat-math-min-max': 'error',
                'unicorn/prefer-unary-minus': 'error',
                'unicorn/prefer-regexp-escape': 'error',
                'unicorn/prefer-error-is-error': 'error',
                'unicorn/prefer-promise-try': 'error',
                'unicorn/prefer-promise-static-methods': 'error',
                'unicorn/prefer-temporal-conversion': 'error',
                'unicorn/prefer-uint8array-base64': 'error',
                'unicorn/prefer-uint8array-hex': 'error',

                // ----------------------------------------
                // Collections & iteration
                // ----------------------------------------
                'unicorn/prefer-array-flat': 'error',
                'unicorn/prefer-array-flat-map': 'error',
                'unicorn/prefer-includes': 'error',
                'unicorn/no-for-loop': 'error',
                'unicorn/prefer-set-methods': 'error',
                'unicorn/prefer-has-check': 'error',
                'unicorn/prefer-group-by': 'error',
                'unicorn/prefer-object-iterable-methods': 'error',
                'unicorn/prefer-array-iterable-methods': 'error',
                'unicorn/prefer-iterator-to-array': 'error',
                'unicorn/prefer-array-from-async': 'error',
                'unicorn/prefer-iterator-zip': 'error',

                // ----------------------------------------
                // Async & URL
                // ----------------------------------------
                'unicorn/prefer-optional-catch-binding': 'error',
                'unicorn/prefer-promise-with-resolvers': 'error',
                'unicorn/prefer-queue-microtask': 'error',
                'unicorn/prefer-url-can-parse': 'error',
                'unicorn/prefer-url-href': 'error',
                'unicorn/prefer-url-search-parameters': 'error',
                'unicorn/no-url-in-search-params': 'error',
                'unicorn/no-invalid-url-protocol-comparison': 'error',
                'unicorn/no-invalid-response-options': 'error',
                'unicorn/require-text-decoder-streaming': 'error',

                // ----------------------------------------
                // Likely bugs
                // ----------------------------------------
                'unicorn/no-instanceof-builtins': 'error',
                'unicorn/no-accidental-bitwise-operator': 'error',
                'unicorn/no-xor-as-exponentiation': 'error',
                'unicorn/no-array-fill-with-reference-type': 'error',
                'unicorn/no-async-promise-finally': 'error',
                'unicorn/no-multiple-promise-resolver-calls': 'error',
                'unicorn/no-duplicate-logical-operands': 'error',
                'unicorn/no-duplicate-if-branches': 'error',
                'unicorn/no-duplicate-set-values': 'error',
                'unicorn/no-impossible-length-comparison': 'error',
                'unicorn/no-invalid-character-comparison': 'error',
                'unicorn/no-invalid-well-known-symbol-methods': 'error',
                'unicorn/no-mismatched-map-key': 'error',
                'unicorn/no-misrefactored-assignment': 'error',
                'unicorn/no-redundant-comparison': 'error',
                'unicorn/no-double-comparison': 'error',
                'unicorn/no-constant-zero-expression': 'error',
                'unicorn/no-return-array-push': 'error',
                'unicorn/no-unused-builtin-method-return': 'error',
                'unicorn/no-shorthand-property-overrides': 'error',
                'unicorn/no-unsafe-property-key': 'error',
                'unicorn/no-negated-array-predicate': 'error',
                'unicorn/no-async-iterator-callback': 'error',
                'unicorn/no-unused-iterator-helper': 'error',
                'unicorn/no-incomplete-accessor-override': 'error',
                'unicorn/no-invalid-property-descriptor': 'error',
                'unicorn/no-invalid-intl-options': 'error',
                'unicorn/no-invalid-temporal-arithmetic': 'error',
                'unicorn/no-unsafe-json-serialization': 'error',
                'unicorn/no-using-resource-escape': 'error',

                // ----------------------------------------
                // Redundant code
                // ----------------------------------------
                'unicorn/no-useless-coercion': 'error',
                'unicorn/no-useless-boolean-cast': 'error',
                'unicorn/no-useless-template-literals': 'error',
                'unicorn/no-useless-compound-assignment': 'error',
                'unicorn/no-useless-continue': 'error',
                'unicorn/no-useless-delete-check': 'error',
                'unicorn/no-useless-override': 'error',
                'unicorn/no-unnecessary-boolean-comparison': 'error',
                'unicorn/no-unnecessary-array-flat-map': 'error',
                'unicorn/no-unnecessary-global-this': 'error',
                'unicorn/no-unnecessary-string-trim': 'error',
                'unicorn/no-unnecessary-splice': 'error',
                'unicorn/no-unnecessary-fetch-options': 'error',
                'unicorn/prefer-simplified-conditions': 'error',
                'unicorn/prefer-boolean-return': 'error',
                'unicorn/prefer-early-return': 'error',
                'unicorn/prefer-combined-guards': 'error',
                'unicorn/no-useless-set-construction': 'error',
                'unicorn/no-unnecessary-default-arguments': 'error',

                // ----------------------------------------
                // DOM (inert outside browser code)
                // ----------------------------------------
                'unicorn/no-incorrect-query-selector': 'error',
                'unicorn/no-selector-as-dom-name': 'error',
                'unicorn/require-css-escape': 'error',
                'unicorn/prefer-add-event-listener-options': 'error',
                'unicorn/no-prevent-default-in-passive-listener': 'error',
                'unicorn/no-invalid-dom-token': 'error',
                'unicorn/no-invalid-style-set-property': 'error',
                'unicorn/no-invalid-boolean-attribute-value': 'error',
                'unicorn/no-conflicting-constraints': 'error',
                'unicorn/no-ineffective-csp-directives': 'error',
                'unicorn/no-invalid-integrity': 'error',

                // ----------------------------------------
                // Literals & formatting
                // ----------------------------------------
                'unicorn/prefer-short-escape-sequences': 'error',
                'unicorn/prefer-literal-ascii': 'error',
                'unicorn/prefer-escaped-irregular-whitespace': 'error',
                'unicorn/no-leading-empty-lines': 'error',
            },
        },
    ];
}
