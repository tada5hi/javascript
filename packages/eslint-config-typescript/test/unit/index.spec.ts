import { describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import eslintConfigTypescript from '../../src/index.ts';

describe('eslint-config-typescript', () => {
    const linter = new Linter();

    it('should return a valid flat config array', () => {
        const config = eslintConfigTypescript();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include base config rules', () => {
        const config = eslintConfigTypescript();
        const messages = linter.verify(
            'var x = 1;\n',
            config,
            { filename: 'test.ts' },
        );
        const error = messages.find((m) => m.ruleId === 'no-var');
        expect(error).toBeDefined();
    });

    it('should allow explicit any', () => {
        const config = eslintConfigTypescript();
        const messages = linter.verify(
            'const x: any = 1;\n',
            config,
            { filename: 'test.ts' },
        );
        const error = messages.find((m) => m.ruleId === '@typescript-eslint/no-explicit-any');
        expect(error).toBeUndefined();
    });

    it('should not crash on non-type imports without type info', () => {
        const config = eslintConfigTypescript();
        const messages = linter.verify(
            'import { Foo } from \'./types\';\nconst x: Foo = {} as Foo;\n',
            config,
            { filename: 'test.ts' },
        );
        // This rule may need type information to work; just verify no crash
        expect(Array.isArray(messages)).toBe(true);
    });

    it('should accept project option', () => {
        const config = eslintConfigTypescript({ project: './tsconfig.json' });
        expect(Array.isArray(config)).toBe(true);
        const hasParserOptions = config.some(
            (c: any) => c.languageOptions?.parserOptions?.project === './tsconfig.json',
        );
        expect(hasParserOptions).toBe(true);
    });

    it('should enable projectService when project is true', () => {
        const config = eslintConfigTypescript({ project: true });
        expect(Array.isArray(config)).toBe(true);
        const hasProjectService = config.some(
            (c: any) => c.languageOptions?.parserOptions?.projectService === true,
        );
        expect(hasProjectService).toBe(true);
    });
});
