/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type * as NodeFs from 'node:fs';
import markdown from '@eslint/markdown';
import { RuleTester } from 'eslint';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    collectImportGraph,
    findImports,
    maskMarkdown,
} from '../../src/agent-docs/index.ts';
import type { AgentDocFileSystem } from '../../src/agent-docs/index.ts';
import importBudget from '../../src/rules/agent-docs-import-budget.ts';
import maxSize from '../../src/rules/agent-docs-max-size.ts';
import noHistory from '../../src/rules/agent-docs-no-history.ts';

const files = vi.hoisted(() => new Map<string, string>());

vi.mock('node:fs', async (importOriginal) => {
    const actual = await importOriginal<typeof NodeFs>();

    return {
        ...actual,
        statSync: (path: string) => {
            if (!files.has(path)) {
                throw new Error(`ENOENT: ${path}`);
            }

            return { isFile: () => true };
        },
        readFileSync: (path: string) => {
            const content = files.get(path);

            if (content === undefined) {
                throw new Error(`ENOENT: ${path}`);
            }

            return content;
        },
    };
});

function memoryFileSystem(entries: Record<string, string>): AgentDocFileSystem {
    return {
        isFile: (path) => path in entries,
        read: (path) => entries[path],
    };
}

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({
    plugins: { markdown },
    language: 'markdown/commonmark',
});

describe('maskMarkdown', () => {
    it('should keep offsets and hide code and comments', () => {
        const text = 'a `used to` b\n```\nno longer\n```\n<!-- plan 123 -->\nc';
        const masked = maskMarkdown(text);

        expect(masked.text).toHaveLength(text.length);
        expect(masked.text).not.toMatch(/used to|no longer|plan 123/);
        expect(masked.text.startsWith('a ')).toBe(true);
        expect(masked.text.endsWith('\nc')).toBe(true);
    });

    it('should hide indented code blocks', () => {
        expect(maskMarkdown('a\n\n    used to\n').text).not.toContain('used to');
    });

    it('should not end a fence on a line with text after the fence', () => {
        expect(maskMarkdown('~~~\n~~~ not a closer\nused to\n~~~\n').text).not.toContain('used to');
    });

    it('should keep a single backtick inside a double-backtick span masked', () => {
        expect(maskMarkdown('x ``a ` used to`` y').text).not.toContain('used to');
    });

    it('should not hide the rest of the document after a stray backtick', () => {
        expect(maskMarkdown('a stray ` here\n\nused to\n').text).toContain('used to');
    });
});

describe('findImports', () => {
    it('should find imports outside code', () => {
        const paths = findImports('@AGENTS.md\n@.agents/structure.md\nsee `@skip.md`\n\n    @indented.md\n').map((entry) => entry.path);

        expect(paths).toEqual(['AGENTS.md', '.agents/structure.md']);
    });

    it('should ignore e-mail addresses and strip trailing punctuation', () => {
        expect(findImports('mail a@b.md, then @x.md.').map((entry) => entry.path)).toEqual(['x.md']);
    });

    it('should accept absolute and non-ASCII paths', () => {
        expect(findImports('@/tmp/shared.md and @docs/日本語.md').map((entry) => entry.path))
            .toEqual(['/tmp/shared.md', 'docs/日本語.md']);
    });
});

describe('collectImportGraph', () => {
    it('should expand a shared file at its shortest distance', () => {
        // a -> b -> c -> d -> e reaches `shared` at hop five, where it is not
        // expanded; the root also imports it directly, so its import counts.
        const fileSystem = memoryFileSystem({
            '/r/a.md': '@b.md',
            '/r/b.md': '@c.md',
            '/r/c.md': '@d.md',
            '/r/d.md': '@shared.md',
            '/r/shared.md': '@leaf.md',
            '/r/leaf.md': 'x'.repeat(100),
        });

        const graph = collectImportGraph('/r/CLAUDE.md', '@a.md\n@shared.md\n', fileSystem);

        expect(graph.files.map((file) => file.path)).toContain('/r/leaf.md');
    });

    it('should report a missing import in an imported file on the root import that leads to it', () => {
        const fileSystem = memoryFileSystem({ '/r/topic.md': 'see @details.md' });
        const graph = collectImportGraph('/r/CLAUDE.md', 'intro\n@topic.md\n', fileSystem);

        expect(graph.missing).toEqual([expect.objectContaining({
            path: 'details.md',
            file: '/r/topic.md',
            rootIndex: 6,
            rootLength: 9,
        })]);
    });

    it('should treat an unreadable file as missing', () => {
        const fileSystem: AgentDocFileSystem = {
            isFile: () => true,
            read: () => undefined,
        };

        expect(collectImportGraph('/r/CLAUDE.md', '@locked.md', fileSystem).missing).toHaveLength(1);
    });

    it('should count each file once in a cycle', () => {
        const fileSystem = memoryFileSystem({ '/r/a.md': '@CLAUDE.md\n@a.md' });

        expect(collectImportGraph('/r/CLAUDE.md', '@a.md', fileSystem).files).toHaveLength(2);
    });
});

tester.run('agent-docs-max-size', maxSize, {
    valid: [
        { code: 'small', options: [{ maxBytes: 10 }] },
    ],
    invalid: [
        {
            code: 'this is too long',
            options: [{ maxBytes: 10 }],
            errors: [{
                messageId: 'tooLarge',
                line: 1,
                column: 1,
            }],
        },
    ],
});

tester.run('agent-docs-no-history', noHistory, {
    valid: [
        'The rule as it is now.',
        'An example: `used to`.',
        '```\nit no longer works\n```',
        'Intro.\n\n    indented: it used to work\n',
        '<!-- see plan 042 -->',
        'This helper is used to validate tokens, and keys are\nused to sign.',
        'It can be used to compare.',
        { code: 'it used to work', options: [{ patterns: [String.raw`\bdeprecated\b`] }] },
        { code: 'a\n\n```\nx      y\n```\n', options: [{ patterns: [' {2,}'] }] },
    ],
    invalid: [
        {
            code: 'line\nIt Used To work and is no longer here.',
            errors: [
                {
                    messageId: 'history',
                    line: 2,
                    column: 4,
                    endColumn: 11,
                },
                {
                    messageId: 'history',
                    line: 2,
                    column: 24,
                },
            ],
        },
        {
            code: 'This is no\nlonger supported.',
            errors: [{
                messageId: 'history',
                line: 1,
                column: 9,
                endLine: 2,
            }],
        },
        {
            code: 'Before #123 this was wrong. Pinned by spec.ts. See plan 042.',
            errors: [
                { messageId: 'history' },
                { messageId: 'history' },
                { messageId: 'history' },
            ],
        },
    ],
});

files.set('/repo/AGENTS.md', 'agents\n');
files.set('/repo/.agents/structure.md', 'x'.repeat(100));
files.set('/repo/.agents/topic.md', 'see @details.md\n');

tester.run('agent-docs-import-budget', importBudget, {
    valid: [
        {
            code: '@AGENTS.md\n@.agents/structure.md\n<!-- @.agents/topics/deep.md -->\n',
            filename: '/repo/CLAUDE.md',
            options: [{ maxBytes: 500 }],
        },
        {
            code: 'agents\n',
            filename: '/repo/AGENTS.md',
        },
        {
            code: 'see @authup/kit and `@missing.md`\n',
            filename: '/repo/CLAUDE.md',
        },
    ],
    invalid: [
        {
            code: '@AGENTS.md\n@.agents/structure.md\n',
            filename: '/repo/CLAUDE.md',
            options: [{ maxBytes: 100 }],
            errors: [{ messageId: 'tooLarge', line: 1 }],
        },
        {
            code: 'intro\n@nope.md\n',
            filename: '/repo/CLAUDE.md',
            errors: [{
                messageId: 'missing',
                line: 2,
                column: 1,
                endColumn: 9,
            }],
        },
        {
            code: 'intro\n@.agents/topic.md\n',
            filename: '/repo/CLAUDE.md',
            errors: [{
                messageId: 'missingNested',
                line: 2,
                column: 1,
                endColumn: 18,
            }],
        },
    ],
});
