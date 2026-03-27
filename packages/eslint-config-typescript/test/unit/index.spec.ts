import {
    describe, 
    expect, 
    it 
} from 'vitest';
import { Linter } from 'eslint';
import eslintConfigTypescript from '../../src/index.ts';

describe('eslint-config-typescript (deprecated wrapper)', () => {
    const linter = new Linter();

    it('should return a valid flat config array', async () => {
        const config = await eslintConfigTypescript();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include base config rules', async () => {
        const config = await eslintConfigTypescript();
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
        const config = await eslintConfigTypescript();
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

    it('should accept project option', async () => {
        const config = await eslintConfigTypescript({
            project: './tsconfig.json' 
        });
        expect(Array.isArray(config)).toBe(true);
        const hasParserOptions = config.some(
            (c: any) => c.languageOptions?.parserOptions?.project === './tsconfig.json',
        );
        expect(hasParserOptions).toBe(true);
    });

    it('should enable projectService when project is true', async () => {
        const config = await eslintConfigTypescript({
            project: true 
        });
        expect(Array.isArray(config)).toBe(true);
        const hasProjectService = config.some(
            (c: any) => c.languageOptions?.parserOptions?.projectService === true,
        );
        expect(hasProjectService).toBe(true);
    });
});
