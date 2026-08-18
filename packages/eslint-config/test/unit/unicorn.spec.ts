/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import eslintConfig from '../../src/index.ts';

describe('unicorn rules', () => {
    const linter = new Linter();

    async function getConfig() {
        return eslintConfig({
            typescript: false,
            vue: false,
        });
    }

    async function getUnicornRuleNames() {
        const config = await getConfig();
        const names = new Set<string>();

        for (const entry of config) {
            for (const name of Object.keys(entry.rules ?? {})) {
                if (name.startsWith('unicorn/')) {
                    names.add(name);
                }
            }
        }

        return [...names];
    }

    it('should only configure rules that exist in the plugin', async () => {
        const names = await getUnicornRuleNames();

        expect(names.length).toBeGreaterThan(0);

        const unknown = names.filter((name) => !unicornPlugin.rules[name.replace('unicorn/', '')]);
        expect(unknown).toEqual([]);
    });

    it('should not configure deprecated rules', async () => {
        const names = await getUnicornRuleNames();

        const deprecated = names.filter((name) => {
            const rule = unicornPlugin.rules[name.replace('unicorn/', '')];
            return Boolean(rule?.meta?.deprecated);
        });

        expect(deprecated).toEqual([]);
    });

    it('should enforce unicorn/no-instanceof-builtins', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = [];\nconst y = x instanceof Array;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-instanceof-builtins');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-array-fill-with-reference-type', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = Array.from({ length: 3 }).fill([]);\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-array-fill-with-reference-type');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-duplicate-logical-operands', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => x && x;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-duplicate-logical-operands');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/require-array-sort-compare', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = [3, 1, 2].sort();\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/require-array-sort-compare');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-impossible-length-comparison', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => x.length < 0;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-impossible-length-comparison');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/no-useless-coercion', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = String(\'x\');\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/no-useless-coercion');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/prefer-math-abs', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const f = (x) => (x < 0 ? -x : x);\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/prefer-math-abs');
        expect(error).toBeDefined();
    });
});
