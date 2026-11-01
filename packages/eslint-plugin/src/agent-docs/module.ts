/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type {
    AgentDocFile,
    AgentDocImport,
    AgentDocImportGraph,
} from './types.ts';

/**
 * Phrases that narrate history or cite a local artifact instead of
 * stating a rule. Matched case-insensitively.
 */
export const AGENT_DOCS_HISTORY_PATTERNS: string[] = [
    String.raw`\bplan [0-9]{3}\b`,
    String.raw`\bused to\b`,
    String.raw`\bbefore #[0-9]`,
    String.raw`\bno longer\b`,
    String.raw`\bpinned by\b`,
];

/**
 * Claude Code follows imports at most this many hops deep.
 */
export const AGENT_DOCS_IMPORT_MAX_DEPTH = 5;

function blank(value: string): string {
    return value.replace(/[^\n]/g, ' ');
}

/**
 * Replace fenced code blocks, inline code and HTML comments with spaces,
 * keeping every offset and line break. Claude Code ignores imports inside
 * code, and a phrase quoted in code is an example, not a statement.
 */
export function maskMarkdown(text: string): string {
    let output = text.replace(/<!--[\s\S]*?(?:-->|$)/g, blank);

    output = output.replace(
        /^( {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^ {0,3}\2[^\n]*$|(?![\s\S]))/gm,
        blank,
    );

    // An inline code span may wrap onto the next line but never crosses a blank line.
    return output.replace(/(`+)(?:[^`\n]|\n(?![ \t]*\n))+?\1/g, blank);
}

/**
 * Every `@path` token in the text that is not inside code or a comment.
 */
export function findImports(text: string): AgentDocImport[] {
    const masked = maskMarkdown(text);
    const output: AgentDocImport[] = [];
    const pattern = /(^|[\s(])@((?:\.{1,2}\/)?[\w.-][\w./-]*)/g;

    let match = pattern.exec(masked);

    while (match) {
        const lead = match[1] ?? '';
        const path = (match[2] ?? '').replace(/[.,:;)]+$/, '');

        if (path.length > 0) {
            output.push({ path, index: match.index + lead.length });
        }

        match = pattern.exec(masked);
    }

    return output;
}

function isFile(path: string): boolean {
    try {
        return statSync(path).isFile();
    } catch {
        return false;
    }
}

/**
 * The files a root agent document loads, following `@` imports the way
 * Claude Code does: relative to the importing file, at most
 * {@link AGENT_DOCS_IMPORT_MAX_DEPTH} hops, each file counted once. A token
 * that resolves to no file is ignored (`@scope/package` mentions are common)
 * unless it names a Markdown file, which is reported as missing.
 */
export function collectImportGraph(rootPath: string, rootText: string): AgentDocImportGraph {
    const files: AgentDocFile[] = [{ path: rootPath, bytes: Buffer.byteLength(rootText) }];
    const seen = new Set<string>([rootPath]);
    const missing: AgentDocImport[] = [];

    const visit = (file: string, text: string, depth: number) => {
        if (depth >= AGENT_DOCS_IMPORT_MAX_DEPTH) {
            return;
        }

        for (const entry of findImports(text)) {
            const target = resolve(dirname(file), entry.path);

            if (!isFile(target)) {
                if (file === rootPath && /\.md$/i.test(entry.path)) {
                    missing.push(entry);
                }

                continue;
            }

            if (seen.has(target)) {
                continue;
            }

            seen.add(target);

            const content = readFileSync(target, 'utf8');

            files.push({ path: target, bytes: Buffer.byteLength(content) });
            visit(target, content, depth + 1);
        }
    };

    visit(rootPath, rootText, 0);

    return { files, missing };
}
