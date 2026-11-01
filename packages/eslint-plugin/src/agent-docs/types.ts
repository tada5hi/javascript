/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type AgentDocImport = {
    /**
     * The path as written after the `@`.
     */
    path: string,
    /**
     * Offset of the `@` in the importing file's text.
     */
    index: number,
};

export type AgentDocFile = {
    /**
     * Absolute path of the file.
     */
    path: string,
    bytes: number,
};

export type AgentDocImportGraph = {
    /**
     * Every file the root loads, the root included, each once.
     */
    files: AgentDocFile[],
    /**
     * Imports of the root that name a Markdown file which does not exist.
     */
    missing: AgentDocImport[],
};
