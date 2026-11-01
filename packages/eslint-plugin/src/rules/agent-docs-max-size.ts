/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Rule } from 'eslint';
import { locFromIndex, onFile } from '../agent-docs/index.ts';

const DEFAULT_MAX_BYTES = 40000;

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Limit the size of an agent document (CLAUDE.md, AGENTS.md, .agents/**/*.md).' },
        schema: [{
            type: 'object',
            properties: { maxBytes: { type: 'integer', minimum: 1 } },
            additionalProperties: false,
        }],
        messages: { tooLarge: 'This agent document is {{bytes}} bytes, over the {{max}}-byte limit. Move subsystem detail into an on-demand topic file, and cut what the code already shows.' },
    },
    create(context) {
        const [{ maxBytes = DEFAULT_MAX_BYTES } = {}] = context.options as [{ maxBytes?: number }?];

        return onFile(() => {
            const bytes = Buffer.byteLength(context.sourceCode.text);

            if (bytes > maxBytes) {
                context.report({
                    loc: { start: locFromIndex(context, 0), end: locFromIndex(context, 0) },
                    messageId: 'tooLarge',
                    data: { bytes: String(bytes), max: String(maxBytes) },
                });
            }
        });
    },
};

export default rule;
