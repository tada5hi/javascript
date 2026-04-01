/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    describe, 
    expect, 
    it 
} from 'vitest';
import { Linter } from 'eslint';
import eslintConfig from '../../src/index.ts';

describe('typescript rules', () => {
    const linter = new Linter();

    async function getConfig(options = {}) {
        return eslintConfig({
            typescript: options,
            vue: false 
        });
    }

    it('should return a valid flat config array', async () => {
        const config = await getConfig();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include base config rules', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'var x = 1;\n',
            config,
            {
                filename: 'test.ts' 
            },
        );
        const error = messages.find((m) => m.ruleId === 'no-var');
        expect(error).toBeDefined();
    });

    it('should allow explicit any', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x: any = 1;\n',
            config,
            {
                filename: 'test.ts' 
            },
        );
        const error = messages.find((m) => m.ruleId === '@typescript-eslint/no-explicit-any');
        expect(error).toBeUndefined();
    });

    it('should not crash on non-type imports without type info', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'import { Foo } from \'./types\';\nconst x: Foo = {} as Foo;\n',
            config,
            {
                filename: 'test.ts' 
            },
        );
        expect(Array.isArray(messages)).toBe(true);
    });

    it('should accept project option', async () => {
        const config = await getConfig({
            project: './tsconfig.json' 
        });
        expect(Array.isArray(config)).toBe(true);
        const hasParserOptions = config.some(
            (c: any) => c.languageOptions?.parserOptions?.project === './tsconfig.json',
        );
        expect(hasParserOptions).toBe(true);
    });

    it('should enforce object-curly-newline for TS type literals', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'type Foo = { a: string,\n    b: number };\n',
            config,
            {
                filename: 'test.ts',
            },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/object-curly-newline');
        expect(error).toBeDefined();
    });

    it('should enable projectService when project is true', async () => {
        const config = await getConfig({
            project: true 
        });
        expect(Array.isArray(config)).toBe(true);
        const hasProjectService = config.some(
            (c: any) => c.languageOptions?.parserOptions?.projectService === true,
        );
        expect(hasProjectService).toBe(true);
    });
});
