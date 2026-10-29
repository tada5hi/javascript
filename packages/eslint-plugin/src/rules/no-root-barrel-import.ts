/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import {
    basename,
    dirname,
    isRelative,
    join,
    knownFilename,
} from '../paths.ts';

const rule: TSESLint.RuleModule<'root', []> = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Prevent internal imports through the nearest src root barrel.' },
        schema: [],
        messages: { root: 'Import from a module or a nested barrel instead of the package src root barrel.' },
    },
    defaultOptions: [],
    create(context) {
        const filename = knownFilename(context.filename);

        if (!filename) {
            return {};
        }

        const marker = filename.lastIndexOf('/src/');
        let root: string | undefined;

        if (marker >= 0) {
            root = filename.slice(0, marker + 4);
        } else if (filename.startsWith('src/')) {
            root = 'src';
        }

        if (!root) {
            return {};
        }

        function check(node: TSESTree.Node, source: string) {
            if (!isRelative(source)) {
                return;
            }

            const target = join(dirname(filename!), source).replace(/\/$/u, '');

            if (target === root || (dirname(target) === root && /^index(?:\.(?:[cm]?[jt]s|[jt]sx))?$/u.test(basename(target)))) {
                context.report({ node, messageId: 'root' });
            }
        }

        return {
            ImportDeclaration(node) {
                check(node.source, node.source.value);
            },
            CallExpression(node) {
                if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
                    return;
                }

                const source = node.arguments[0];

                if (source?.type !== 'Literal' || typeof source.value !== 'string') {
                    return;
                }

                const scope = context.sourceCode.getScope(node);
                let current: typeof scope | null = scope;

                while (current) {
                    if (current.set.get('require')?.defs.length) {
                        return;
                    }

                    current = current.upper;
                }

                check(source, source.value);
            },
            TSExternalModuleReference(node) {
                if (typeof node.expression.value === 'string') {
                    check(node.expression, node.expression.value);
                }
            },
            ImportExpression(node) {
                if (node.source.type === 'Literal' && typeof node.source.value === 'string') {
                    check(node.source, node.source.value);
                } else if (node.source.type === 'TemplateLiteral' && node.source.expressions.length === 0) {
                    const value = node.source.quasis[0]?.value.cooked;

                    if (value !== null && value !== undefined) {
                        check(node.source, value);
                    }
                }
            },
            TSImportType(node) {
                if (typeof node.source.value === 'string') {
                    check(node.source, node.source.value);
                }
            },
        };
    },
};

export default rule;
