/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import {
    basename,
    isAbsolute,
    knownFilename,
    normalizePath,
} from '../paths.ts';

const rule: TSESLint.RuleModule<'barrel' | 'subtree', []> = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Allow re-exports only from directory barrels and only within their subtree.' },
        schema: [],
        messages: {
            barrel: 'Re-export-from declarations belong in an index directory barrel.',
            subtree: 'A directory barrel may only re-export ./ paths within its own subtree.',
        },
    },
    defaultOptions: [],
    create(context) {
        const filename = knownFilename(context.filename);

        if (!filename) {
            return {};
        }

        const isBarrel = /^index\.(?:[cm]?[jt]s|[jt]sx|d\.(?:ts|mts|cts))$/u.test(basename(filename));

        function check(node: TSESTree.ExportAllDeclaration | TSESTree.ExportNamedDeclaration) {
            if (!node.source || node.parent.type !== 'Program') {
                return;
            }

            if (!isBarrel) {
                context.report({ node, messageId: 'barrel' });

                return;
            }

            const source = node.source.value;
            const target = normalizePath(source);

            if (!source.startsWith('./') || target === '..' || target.startsWith('../') || isAbsolute(target)) {
                context.report({ node: node.source, messageId: 'subtree' });
            }
        }

        return {
            ExportAllDeclaration: check,
            ExportNamedDeclaration: check,
        };
    },
};

export default rule;
