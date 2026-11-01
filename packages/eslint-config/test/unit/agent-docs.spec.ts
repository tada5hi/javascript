/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';
import { AGENT_DOCS_FILES } from '../../src/configs/agent-docs/index.ts';

async function lint(filename: string, code: string, options: Parameters<typeof eslintConfig>[0] = {}) {
    const config = await eslintConfig({
        typescript: false,
        vue: false,
        ...options,
    });

    return new Linter({ cwd: '/repo' }).verify(code, config, { filename });
}

function ruleIds(messages: Linter.LintMessage[]) {
    return messages.map((message) => message.ruleId);
}

describe('agent docs', () => {
    it('should check agent documents by default', async () => {
        const messages = await lint('/repo/AGENTS.md', '# Guide\n\nIt used to work.\n');

        expect(ruleIds(messages)).toEqual(['@tada5hi/agent-docs-no-history']);
        expect(messages[0]).toMatchObject({ line: 3, column: 4 });
    });

    it('should leave other markdown files alone', async () => {
        const messages = await lint('/repo/README.md', 'It used to work.\n');

        expect(ruleIds(messages).filter((id) => id?.startsWith('@tada5hi/agent-docs'))).toEqual([]);
    });

    it('should not run code rules on agent documents', async () => {
        const messages = await lint('/repo/.agents/topics/oauth2.md', '# Topic\n\nconst a = 1; var b = 2\n');

        expect(messages).toEqual([]);
    });

    it('should ignore plan files globally', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
        });
        const linter = new Linter({ cwd: '/repo' });

        expect(config).toContainEqual({ name: 'tada5hi/agent-docs/ignores', ignores: ['**/.agents/plans/**'] });
        expect(linter.verify('It used to work.\n', config, { filename: '/repo/.agents/plans/001.md' })
            .some((message) => message.ruleId?.startsWith('@tada5hi/agent-docs'))).toBe(false);
    });

    it('should not lint a plan file even when agentDocs.files matches it', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
            agentDocs: { files: ['**/.agents/**/*.md'] },
        });
        const linter = new Linter({ cwd: '/repo' });
        const ruleIdsOf = (filename: string) => ruleIds(linter.verify('It used to work.\n', config, { filename }))
            .filter((id) => id !== null);

        expect(ruleIdsOf('/repo/.agents/topics/oauth2.md')).toEqual(['@tada5hi/agent-docs-no-history']);
        expect(ruleIdsOf('/repo/.agents/plans/001.md')).toEqual([]);
    });

    it('should replace the ignores with agentDocs.ignores', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
            agentDocs: { ignores: ['**/.agents/drafts/**'] },
        });

        expect(config).toContainEqual({ name: 'tada5hi/agent-docs/ignores', ignores: ['**/.agents/drafts/**'] });
    });

    it('should lint plans with ignores: [] and a matching files glob', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
            agentDocs: {
                ignores: [],
                files: ['**/.agents/plans/*.md'],
            },
        });
        const messages = new Linter({ cwd: '/repo' }).verify('It used to work.\n', config, { filename: '/repo/.agents/plans/001.md' });

        expect(config.some((entry) => entry.name === 'tada5hi/agent-docs/ignores')).toBe(false);
        expect(messages.map((message) => message.ruleId)).toEqual(['@tada5hi/agent-docs-no-history']);
    });

    it('should pass options to the rules', async () => {
        const messages = await lint('/repo/.agents/structure.md', 'x'.repeat(50), {
            agentDocs: {
                maxBytes: 10,
                historyPatterns: [],
            },
        });

        expect(ruleIds(messages)).toEqual(['@tada5hi/agent-docs-max-size']);
    });

    it('should be disabled with agentDocs: false', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
            agentDocs: false,
        });

        expect(config.some((entry) => entry.name?.startsWith('tada5hi/agent-docs'))).toBe(false);
    });

    it('should keep every built-in code block off the agent docs', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: true,
        });

        for (const entry of config) {
            const globalIgnore = Object.keys(entry).every((key) => key === 'ignores' || key === 'name');
            const agentDocBlock = entry.name?.startsWith('tada5hi/agent-docs');

            if (globalIgnore || agentDocBlock || entry.files) {
                continue;
            }

            expect(entry.ignores).toEqual(expect.arrayContaining(AGENT_DOCS_FILES));
        }
    });

    it('should keep a files-less user block off the agent docs', async () => {
        const config = await eslintConfig(
            {
                typescript: true,
                vue: false,
            },
            { rules: { '@typescript-eslint/no-unused-vars': 'error' } },
        );

        const messages = new Linter({ cwd: '/repo' }).verify('# Guide\n', config, { filename: '/repo/AGENTS.md' });

        expect(messages).toEqual([]);
    });

    it('should apply a files-less override of an agent-docs rule to the agent docs', async () => {
        const config = await eslintConfig(
            {
                typescript: false,
                vue: false,
            },
            { rules: { '@tada5hi/agent-docs-no-history': 'off', 'no-console': 'off' } },
        );

        const messages = new Linter({ cwd: '/repo' }).verify('It used to work.\n', config, { filename: '/repo/AGENTS.md' });

        expect(messages).toEqual([]);
        expect(config.at(-2)?.rules).toEqual({ 'no-console': 'off' });
        expect(config.at(-1)?.rules).toEqual({ '@tada5hi/agent-docs-no-history': 'off' });
    });

    it('should keep the ignores of a files-less user block on its agent-docs rules', async () => {
        const config = await eslintConfig(
            {
                typescript: false,
                vue: false,
            },
            { ignores: ['**/.agents/topics/**'], rules: { '@tada5hi/agent-docs-no-history': 'off', 'no-console': 'off' } },
        );
        const linter = new Linter({ cwd: '/repo' });

        expect(ruleIds(linter.verify('It used to work.\n', config, { filename: '/repo/.agents/topics/oauth2.md' })))
            .toEqual(['@tada5hi/agent-docs-no-history']);
        expect(linter.verify('It used to work.\n', config, { filename: '/repo/AGENTS.md' })).toEqual([]);
    });

    it('should lint TypeScript under src without the typescript option', async () => {
        const messages = await lint('/repo/src/example.ts', 'export const a = 1;\n');

        expect(messages.filter((message) => message.fatal)).toEqual([]);
    });

    it('should not add a vue glob without the vue option', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false,
        });
        const globs = config.flatMap((entry) => entry.files ?? []).map(String);

        expect(globs.some((glob) => glob.includes('vue'))).toBe(false);
    });
});
