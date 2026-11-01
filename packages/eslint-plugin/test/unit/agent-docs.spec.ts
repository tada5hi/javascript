/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    mkdirSync,
    mkdtempSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import markdown from '@eslint/markdown';
import { RuleTester } from 'eslint';
import {
    afterAll,
    describe,
    expect,
    it,
} from 'vitest';
import { findImports, maskMarkdown } from '../../src/agent-docs/index.ts';
import importBudget from '../../src/rules/agent-docs-import-budget.ts';
import maxSize from '../../src/rules/agent-docs-max-size.ts';
import noHistory from '../../src/rules/agent-docs-no-history.ts';

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({
    plugins: { markdown },
    language: 'markdown/commonmark',
});

const root = mkdtempSync(join(tmpdir(), 'agent-docs-'));

afterAll(() => {
    rmSync(root, { recursive: true, force: true });
});

function write(path: string, content: string): string {
    const file = join(root, path);

    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, content);

    return file;
}

describe('maskMarkdown', () => {
    it('keeps offsets and hides code and comments', () => {
        const text = 'a `used to` b\n```\nno longer\n```\n<!-- plan 123 -->\nc';
        const masked = maskMarkdown(text);

        expect(masked).toHaveLength(text.length);
        expect(masked).not.toMatch(/used to|no longer|plan 123/);
        expect(masked.startsWith('a ')).toBe(true);
        expect(masked.endsWith('\nc')).toBe(true);
    });

    it('lets an inline code span wrap but not cross a blank line', () => {
        expect(maskMarkdown('`POST\n/token` x')).toBe(`${' '.repeat(5)  }\n${  ' '.repeat(7)  } x`);
        expect(maskMarkdown('a ` b\n\nused to')).toContain('used to');
    });
});

describe('findImports', () => {
    it('finds @-imports outside code', () => {
        expect(findImports('@AGENTS.md\n@.agents/structure.md\nsee `@skip.md`').map((entry) => entry.path))
            .toEqual(['AGENTS.md', '.agents/structure.md']);
    });

    it('ignores e-mail addresses and strips trailing punctuation', () => {
        expect(findImports('mail a@b.md, then @x.md.').map((entry) => entry.path)).toEqual(['x.md']);
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
        'This helper is used to validate tokens, and keys are\nused to sign.',
        'It can be used to compare.',
        '```\nit no longer works\n```',
        '<!-- see plan 042 -->',
        { code: 'it used to work', options: [{ patterns: ['\\bdeprecated\\b'] }] },
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
            code: 'Before #123 this was wrong. Pinned by spec.ts. See plan 042.',
            errors: [
                { messageId: 'history' },
                { messageId: 'history' },
                { messageId: 'history' },
            ],
        },
    ],
});

const agents = write('repo/AGENTS.md', 'agents\n');

write('repo/.agents/structure.md', 'x'.repeat(100));
write('repo/.agents/topics/deep.md', 'y'.repeat(1000));

const claude = write('repo/CLAUDE.md', '@AGENTS.md\n@.agents/structure.md\n<!-- @.agents/topics/deep.md -->\n');
const missing = write('repo/missing/CLAUDE.md', 'intro\n@nope.md\nsee @authup/kit for details\n');
const cyclic = write('repo/cycle/CLAUDE.md', '@a.md\n');

write('repo/cycle/a.md', '@CLAUDE.md\n@a.md\n');

tester.run('agent-docs-import-budget', importBudget, {
    valid: [
        {
            code: '@AGENTS.md\n@.agents/structure.md\n<!-- @.agents/topics/deep.md -->\n',
            filename: claude,
            options: [{ maxBytes: 500 }],
        },
        {
            code: '@a.md\n',
            filename: cyclic,
            options: [{ maxBytes: 500 }],
        },
        {
            code: 'agents\n',
            filename: agents,
        },
    ],
    invalid: [
        {
            code: '@AGENTS.md\n@.agents/structure.md\n<!-- @.agents/topics/deep.md -->\n',
            filename: claude,
            options: [{ maxBytes: 100 }],
            errors: [{ messageId: 'tooLarge', line: 1 }],
        },
        {
            code: 'intro\n@nope.md\nsee @authup/kit for details\n',
            filename: missing,
            errors: [{
                messageId: 'missing',
                line: 2,
                column: 1,
                endColumn: 9,
            }],
        },
    ],
});
