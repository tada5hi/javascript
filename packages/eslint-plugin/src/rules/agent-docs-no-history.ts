/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Rule } from 'eslint';
import {
    AGENT_DOCS_HISTORY_PATTERNS,
    locFromIndex,
    maskMarkdown,
    onFile,
} from '../agent-docs/index.ts';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: { description: 'Disallow phrases in agent documents that narrate history instead of stating the current rule.' },
        schema: [{
            type: 'object',
            properties: {
                patterns: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
            additionalProperties: false,
        }],
        messages: { history: 'Agent docs describe what the code does now; "{{phrase}}" narrates history. State the rule as it is, and keep the story in the commit or pull request.' },
    },
    create(context) {
        const [{ patterns = AGENT_DOCS_HISTORY_PATTERNS } = {}] = context.options as [{ patterns?: string[] }?];
        const regex = new RegExp(patterns.map((pattern) => `(?:${pattern})`).join('|'), 'gi');

        return onFile(() => {
            const masked = maskMarkdown(context.sourceCode.text);

            for (const match of masked.matchAll(regex)) {
                if (match[0].length === 0 || match.index === undefined) {
                    continue;
                }

                context.report({
                    loc: {
                        start: locFromIndex(context, match.index),
                        end: locFromIndex(context, match.index + match[0].length),
                    },
                    messageId: 'history',
                    data: { phrase: match[0] },
                });
            }
        });
    },
};

export default rule;
