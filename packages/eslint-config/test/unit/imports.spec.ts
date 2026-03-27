/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
    describe, 
    expect, 
    it 
} from 'vitest';
import { Linter } from 'eslint';
import eslintConfig from '../../src/index.ts';

const dataDir = resolve(import.meta.dirname, '..', 'data');

describe('import rules', () => {
    it('should include import plugin', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false 
        });
        const hasPlugin = config.some(
            (c: any) => c.plugins && ('import' in c.plugins),
        );
        expect(hasPlugin).toBe(true);
    });

    it('should lint typescript files without resolver error', async () => {
        const linter = new Linter();
        const config = await eslintConfig({
            typescript: true,
            vue: false 
        });

        const code = readFileSync(resolve(dataDir, 'ts/src/index.ts'), 'utf-8');
        const messages = linter.verify(
            code,
            config,
            {
                filename: resolve(dataDir, 'ts/src/index.ts') 
            },
        );

        const resolverErrors = messages.filter(
            (m) => m.message.includes('resolver') || m.message.includes('Resolve error'),
        );
        expect(resolverErrors).toHaveLength(0);
    });

    it('should lint vue + typescript files without resolver error', async () => {
        const linter = new Linter();
        const config = await eslintConfig({
            typescript: true,
            vue: true 
        });

        const code = readFileSync(resolve(dataDir, 'vue/src/App.vue'), 'utf-8');
        const messages = linter.verify(
            code,
            config,
            {
                filename: resolve(dataDir, 'vue/src/App.vue') 
            },
        );

        const resolverErrors = messages.filter(
            (m) => m.message.includes('resolver') || m.message.includes('Resolve error'),
        );
        expect(resolverErrors).toHaveLength(0);
    });

    it('should enforce imports-first', async () => {
        const linter = new Linter();
        const config = await eslintConfig({
            typescript: false,
            vue: false 
        });

        const messages = linter.verify(
            'const x = 1;\nimport { foo } from \'bar\';\n',
            config,
            {
                filename: 'test.js' 
            },
        );
        const error = messages.find((m) => m.ruleId === 'import/first');
        expect(error).toBeDefined();
    });

    it('should enforce no-duplicate-imports', async () => {
        const linter = new Linter();
        const config = await eslintConfig({
            typescript: false,
            vue: false 
        });

        const messages = linter.verify(
            'import { foo } from \'bar\';\nimport { baz } from \'bar\';\n',
            config,
            {
                filename: 'test.js' 
            },
        );
        const error = messages.find((m) => m.ruleId === 'import/no-duplicates');
        expect(error).toBeDefined();
    });
});
