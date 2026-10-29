/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const methods = new Set([
    'map',
    'filter',
    'flatMap',
    'some',
    'every',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
    'reduce',
    'reduceRight',
]);

const rule: TSESLint.RuleModule<'condition', []> = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Extract collection method calls into named variables before conditions.' },
        schema: [],
        messages: { condition: "Extract the result of '{{method}}' into a named variable before using it in a condition." },
    },
    defaultOptions: [],
    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;

                if (callee.type !== 'MemberExpression') {
                    return;
                }

                let method: string | null | undefined;

                if (!callee.computed && callee.property.type === 'Identifier') {
                    method = callee.property.name;
                } else if (callee.computed && callee.property.type === 'Literal' && typeof callee.property.value === 'string') {
                    method = callee.property.value;
                } else if (callee.computed && callee.property.type === 'TemplateLiteral' && callee.property.expressions.length === 0) {
                    method = callee.property.quasis[0]?.value.cooked;
                }

                if (!method || !methods.has(method)) {
                    return;
                }

                let child: TSESTree.Node = node;
                let { parent }: { parent?: TSESTree.Node } = child;

                while (parent) {
                    if ((parent.type === 'IfStatement' ||
                        parent.type === 'WhileStatement' ||
                        parent.type === 'DoWhileStatement' ||
                        parent.type === 'ForStatement' ||
                        parent.type === 'ConditionalExpression') && parent.test === child) {
                        context.report({
                            node,
                            messageId: 'condition',
                            data: { method },
                        });

                        return;
                    }

                    // Conservatively skip function bodies, including immediately invoked functions.
                    if (parent.type === 'ArrowFunctionExpression' || parent.type === 'FunctionExpression' || parent.type === 'FunctionDeclaration') {
                        return;
                    }

                    // Instance field initializers run during construction, not class evaluation.
                    if (parent.type === 'PropertyDefinition' && !parent.static && parent.value === child) {
                        return;
                    }

                    child = parent;
                    parent = parent.parent;
                }
            },
        };
    },
};

export default rule;
