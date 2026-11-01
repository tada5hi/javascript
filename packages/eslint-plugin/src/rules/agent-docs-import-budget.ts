/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { basename, dirname, relative } from 'node:path';
import type { Rule } from 'eslint';
import {
    collectImportGraph,
    locFromIndex,
    onFile,
} from '../agent-docs/index.ts';

const DEFAULT_MAX_BYTES = 60000;

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Limit what a root agent document (CLAUDE.md, AGENTS.md) loads into every session, following its @-imports, and report imports that do not resolve.' },
        schema: [{
            type: 'object',
            properties: { maxBytes: { type: 'integer', minimum: 1 } },
            additionalProperties: false,
        }],
        messages: {
            tooLarge: 'This file loads {{bytes}} bytes into every session, over the {{max}}-byte limit. Largest: {{largest}}. Move detail into topic files that are read on demand and not imported.',
            missing: 'The import "@{{path}}" does not resolve to a file.',
            missingNested: '{{file}} imports "@{{path}}", which does not resolve to a file (reached through this import).',
        },
    },
    create(context) {
        const [{ maxBytes = DEFAULT_MAX_BYTES } = {}] = context.options as [{ maxBytes?: number }?];
        const { filename } = context;

        if (!filename || filename.startsWith('<')) {
            return {};
        }

        return onFile(() => {
            const graph = collectImportGraph(filename, context.sourceCode.text);

            for (const entry of graph.missing) {
                const nested = entry.file !== filename;

                context.report({
                    loc: {
                        start: locFromIndex(context, entry.rootIndex),
                        end: locFromIndex(context, entry.rootIndex + entry.rootLength),
                    },
                    messageId: nested ? 'missingNested' : 'missing',
                    data: {
                        path: entry.path,
                        file: relative(dirname(filename), entry.file),
                    },
                });
            }

            const total = graph.files.reduce((sum, file) => sum + file.bytes, 0);

            if (total <= maxBytes) {
                return;
            }

            const largest = [...graph.files]
                .sort((a, b) => b.bytes - a.bytes)
                .slice(0, 3)
                .map((file) => `${basename(file.path)} (${file.bytes})`)
                .join(', ');

            const start = locFromIndex(context, 0);

            context.report({
                loc: { start, end: start },
                messageId: 'tooLarge',
                data: {
                    bytes: String(total),
                    max: String(maxBytes),
                    largest,
                },
            });
        });
    },
};

export default rule;
