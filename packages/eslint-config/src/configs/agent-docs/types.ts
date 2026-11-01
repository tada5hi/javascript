/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type AgentDocsOptions = {
    /**
     * Agent documents checked for size and history phrases.
     *
     * default: CLAUDE.md, AGENTS.md, .agents/*.md, .agents/topics/**\/*.md
     */
    files?: string[],
    /**
     * Root documents whose `@` imports are followed and summed: what a
     * session loads before any task starts.
     *
     * default: CLAUDE.md, AGENTS.md
     */
    rootFiles?: string[],
    /**
     * Globs ESLint ignores altogether (a global ignore), replacing the
     * default. `[]` removes it, e.g. to lint plans through `files`.
     *
     * default: .agents/plans/**
     */
    ignores?: string[],
    /**
     * Largest size of a single agent document, in bytes.
     *
     * default: 40000
     */
    maxBytes?: number,
    /**
     * Largest size a root document may load including its imports, in bytes.
     *
     * default: 60000
     */
    importMaxBytes?: number,
    /**
     * Regular expressions (case-insensitive) for phrases that narrate history.
     */
    historyPatterns?: string[],
};
