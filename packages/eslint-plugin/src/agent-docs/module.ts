/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Nodes } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type {
    AgentDocFile,
    AgentDocFileSystem,
    AgentDocImport,
    AgentDocImportGraph,
    AgentDocMasked,
    AgentDocMissingImport,
    AgentDocRange,
} from './types.ts';

/**
 * Phrases that narrate history or cite a local artifact instead of stating a
 * rule. Matched case-insensitively; `\s+` lets a phrase wrap onto the next
 * line. "used to" after a form of "be" or "get" is the passive voice ("is used
 * to validate"), which states a current fact, so it does not match.
 */
export const AGENT_DOCS_HISTORY_PATTERNS: string[] = [
    String.raw`\bplan\s+[0-9]{3}\b`,
    String.raw`(?<!\b(?:is|are|am|be|been|being|was|were|get|gets|got|getting)\s+)\bused\s+to\b`,
    String.raw`\bbefore\s+#[0-9]`,
    String.raw`\bno\s+longer\b`,
    String.raw`\bpinned\s+by\b`,
];

/**
 * Claude Code follows imports at most this many hops deep.
 */
export const AGENT_DOCS_IMPORT_MAX_DEPTH = 5;

const MASKED_TYPES = new Set(['code', 'inlineCode', 'html']);

export const nodeFileSystem: AgentDocFileSystem = {
    isFile(path) {
        try {
            return statSync(path).isFile();
        } catch {
            return false;
        }
    },
    read(path) {
        try {
            return readFileSync(path, 'utf8');
        } catch {
            return undefined;
        }
    },
};

function collectRanges(node: Nodes, ranges: AgentDocRange[]) {
    if (MASKED_TYPES.has(node.type)) {
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;

        if (start !== undefined && end !== undefined) {
            ranges.push({ start, end });
        }

        return;
    }

    if ('children' in node) {
        for (const child of node.children) {
            collectRanges(child, ranges);
        }
    }
}

/**
 * Replace code blocks (fenced and indented), code spans and HTML, comments
 * included, with spaces, keeping every offset and line break. The regions
 * come from a CommonMark parse, so delimiters inside code never end it early.
 * Claude Code ignores imports inside code, and a phrase quoted in code is an
 * example, not a statement.
 */
export function maskMarkdown(text: string): AgentDocMasked {
    const ranges: AgentDocRange[] = [];

    collectRanges(fromMarkdown(text), ranges);

    let output = '';
    let cursor = 0;

    for (const range of ranges) {
        output += text.slice(cursor, range.start) + text.slice(range.start, range.end).replace(/[^\n]/g, ' ');
        cursor = range.end;
    }

    return { text: output + text.slice(cursor), ranges };
}

/**
 * Whether `[start, end)` overlaps a masked region.
 */
export function overlapsMasked(masked: AgentDocMasked, start: number, end: number): boolean {
    return masked.ranges.some((range) => start < range.end && range.start < end);
}

/**
 * Every `@path` token in the text that is not inside code or HTML.
 */
export function findImports(text: string): AgentDocImport[] {
    const masked = maskMarkdown(text).text;
    const output: AgentDocImport[] = [];
    const pattern = /(^|[\s(])@((?:\.{1,2}\/|\/)?[\p{L}\p{N}_.-][\p{L}\p{N}_./-]*)/gu;

    for (const match of masked.matchAll(pattern)) {
        const lead = match[1] ?? '';
        const path = (match[2] ?? '').replace(/[.,:;)]+$/, '');

        if (path.length > 0) {
            output.push({ path, index: match.index + lead.length });
        }
    }

    return output;
}

type QueueEntry = {
    file: string,
    text: string,
    depth: number,
    rootIndex: number,
    rootLength: number,
};

/**
 * The files a root agent document loads, following `@` imports the way
 * Claude Code does: relative to the importing file, at most
 * {@link AGENT_DOCS_IMPORT_MAX_DEPTH} hops, each file counted once. The walk is
 * breadth first, so every file is expanded at its shortest distance from the
 * root and the total does not depend on import order. A token that resolves
 * to no file is ignored (`@scope/package` mentions are common) unless it names
 * a Markdown file, which is reported as missing, wherever in the graph it is.
 */
export function collectImportGraph(
    rootPath: string,
    rootText: string,
    fileSystem: AgentDocFileSystem = nodeFileSystem,
): AgentDocImportGraph {
    const files: AgentDocFile[] = [{ path: rootPath, bytes: Buffer.byteLength(rootText) }];
    const seen = new Set<string>([rootPath]);
    const missing: AgentDocMissingImport[] = [];
    const queue: QueueEntry[] = [{
        file: rootPath,
        text: rootText,
        depth: 0,
        rootIndex: 0,
        rootLength: 0,
    }];

    for (let entry = queue.shift(); entry; entry = queue.shift()) {
        if (entry.depth >= AGENT_DOCS_IMPORT_MAX_DEPTH) {
            continue;
        }

        const isRoot = entry.depth === 0;

        for (const item of findImports(entry.text)) {
            const target = resolve(dirname(entry.file), item.path);
            const rootIndex = isRoot ? item.index : entry.rootIndex;
            const rootLength = isRoot ? item.path.length + 1 : entry.rootLength;

            const content = fileSystem.isFile(target) ? fileSystem.read(target) : undefined;

            if (content === undefined) {
                if (/\.md$/i.test(item.path)) {
                    missing.push({
                        ...item,
                        file: entry.file,
                        rootIndex,
                        rootLength,
                    });
                }

                continue;
            }

            if (seen.has(target)) {
                continue;
            }

            seen.add(target);
            files.push({ path: target, bytes: Buffer.byteLength(content) });
            queue.push({
                file: target,
                text: content,
                depth: entry.depth + 1,
                rootIndex,
                rootLength,
            });
        }
    }

    return { files, missing };
}
