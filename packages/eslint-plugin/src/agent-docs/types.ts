/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type AgentDocRange = {
    start: number,
    end: number,
};

export type AgentDocMasked = {
    /**
     * The text with code and HTML comments replaced by spaces, offsets and
     * line breaks kept.
     */
    text: string,
    /**
     * The replaced regions, in source order.
     */
    ranges: AgentDocRange[],
};

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

export type AgentDocMissingImport = AgentDocImport & {
    /**
     * Absolute path of the file that holds the import.
     */
    file: string,
    /**
     * Offset in the root document of the import that starts the chain to
     * `file`; equal to `index` when the root holds the import itself.
     */
    rootIndex: number,
    /**
     * Length of the root import at `rootIndex`, the `@` included.
     */
    rootLength: number,
};

export type AgentDocImportGraph = {
    /**
     * Every file the root loads, the root included, each once.
     */
    files: AgentDocFile[],
    /**
     * Imports anywhere in the graph that name a Markdown file which cannot
     * be read.
     */
    missing: AgentDocMissingImport[],
};

export type AgentDocFileSystem = {
    isFile(path: string): boolean,
    read(path: string): string | undefined,
};
