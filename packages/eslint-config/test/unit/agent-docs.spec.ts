/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';

async function lintMarkdown(filePath: string, code: string, options: Parameters<typeof eslintConfig>[0] = {}) {
    const eslint = new ESLint({
        overrideConfigFile: true,
        overrideConfig: await eslintConfig({
            typescript: false,
            vue: false,
            ...options,
        }),
    });

    const [result] = await eslint.lintText(code, { filePath });

    return result;
}

describe('agent docs', () => {
    it('should check agent documents by default', async () => {
        const result = await lintMarkdown('AGENTS.md', '# Guide\n\nIt used to work.\n');

        expect(result?.messages.map((message) => message.ruleId)).toEqual(['@tada5hi/agent-docs-no-history']);
        expect(result?.messages[0]).toMatchObject({ line: 3, column: 4 });
    });

    it('should leave other markdown files alone', async () => {
        const result = await lintMarkdown('README.md', 'It used to work.\n');

        expect(result?.messages).toEqual([expect.objectContaining({ message: expect.stringMatching(/ignored/i) })]);
    });

    it('should not run code rules on agent documents', async () => {
        const result = await lintMarkdown('.agents/topics/oauth2.md', '# Topic\n\nconst a = 1; var b = 2\n');

        expect(result?.messages).toEqual([]);
    });

    it('should pass options to the rules', async () => {
        const result = await lintMarkdown('.agents/structure.md', 'x'.repeat(50), {
            agentDocs: {
                maxBytes: 10,
                historyPatterns: [],
            },
        });

        expect(result?.messages.map((message) => message.ruleId)).toEqual(['@tada5hi/agent-docs-max-size']);
    });

    it('should be disabled with agentDocs: false', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
            agentDocs: false,
        });

        expect(config.some((entry) => entry.name?.startsWith('tada5hi/agent-docs'))).toBe(false);
    });

    it('should scope every built-in block to files or keep it a global ignore', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: true,
        });

        for (const entry of config) {
            const globalIgnore = Object.keys(entry).every((key) => key === 'ignores' || key === 'name');

            expect(globalIgnore || Array.isArray(entry.files)).toBe(true);
        }
    });

    it('should not match vue files unless vue is enabled', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
        });

        expect(config.some((entry) => entry.files?.some((glob) => String(glob).includes('vue')))).toBe(false);
    });
});
