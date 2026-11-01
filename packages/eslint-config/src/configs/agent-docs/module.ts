/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import markdown from '@eslint/markdown';
import tada5hi from '@tada5hi/eslint-plugin';
import type { Linter } from 'eslint';
import type { AgentDocsOptions } from './types.ts';

export const AGENT_DOCS_FILES = [
    '**/CLAUDE.md',
    '**/AGENTS.md',
    '**/.agents/*.md',
    '**/.agents/topics/**/*.md',
];

export const AGENT_DOCS_ROOT_FILES = [
    '**/CLAUDE.md',
    '**/AGENTS.md',
];

/**
 * Plans are working documents and gitignored by convention; ESLint does not
 * read .gitignore, so they are ignored explicitly.
 */
export const AGENT_DOCS_IGNORES = [
    '**/.agents/plans/**',
];

export function agentDocs(options: AgentDocsOptions = {}): Linter.Config[] {
    const files = options.files ?? AGENT_DOCS_FILES;

    return [
        {
            name: 'tada5hi/agent-docs/ignores',
            ignores: AGENT_DOCS_IGNORES,
        },
        {
            name: 'tada5hi/agent-docs',
            files,
            language: 'markdown/commonmark',
            plugins: {
                markdown,
                '@tada5hi': tada5hi,
            },
            rules: {
                '@tada5hi/agent-docs-max-size': ['error', { ...(options.maxBytes ? { maxBytes: options.maxBytes } : {}) }],
                '@tada5hi/agent-docs-no-history': ['error', { ...(options.historyPatterns ? { patterns: options.historyPatterns } : {}) }],
            },
        },
        {
            name: 'tada5hi/agent-docs/imports',
            files: options.rootFiles ?? AGENT_DOCS_ROOT_FILES,
            language: 'markdown/commonmark',
            plugins: {
                markdown,
                '@tada5hi': tada5hi,
            },
            rules: { '@tada5hi/agent-docs-import-budget': ['error', { ...(options.importMaxBytes ? { maxBytes: options.importMaxBytes } : {}) }] },
        },
    ];
}
