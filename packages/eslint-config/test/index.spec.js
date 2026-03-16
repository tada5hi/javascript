import { describe, it, expect } from 'vitest';
import { Linter } from 'eslint';
import eslintConfig from '../index.js';

describe('eslint-config', () => {
    const linter = new Linter();

    it('should return a valid flat config array', () => {
        const config = eslintConfig();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should enforce single quotes', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'const x = "hello";\n',
            config,
            { filename: 'test.js' },
        );
        const quoteError = messages.find((m) => m.ruleId === '@stylistic/quotes');
        expect(quoteError).toBeDefined();
    });

    it('should enforce 4-space indentation', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'function foo() {\n  return true;\n}\n',
            config,
            { filename: 'test.js' },
        );
        const indentError = messages.find((m) => m.ruleId === '@stylistic/indent');
        expect(indentError).toBeDefined();
    });

    it('should allow no-await-in-loop', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'async function foo(items) {\n    for (const item of items) {\n        await item.process();\n    }\n}\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'no-await-in-loop');
        expect(error).toBeUndefined();
    });

    it('should enforce prefer-const', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'let x = 1;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'prefer-const');
        expect(error).toBeDefined();
    });

    it('should enforce no-var', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'var x = 1;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'no-var');
        expect(error).toBeDefined();
    });

    it('should enforce eqeqeq', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'if (x == 1) {}\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'eqeqeq');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/prefer-node-protocol', () => {
        const config = eslintConfig();
        const messages = linter.verify(
            'import fs from \'fs\';\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/prefer-node-protocol');
        expect(error).toBeDefined();
    });

    it('should enforce max-len at 150 characters', () => {
        const config = eslintConfig();
        // Use a long comment line since ignoreStrings is enabled
        const longLine = `// ${'a'.repeat(160)}\n`;
        const messages = linter.verify(
            longLine,
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/max-len');
        expect(error).toBeDefined();
    });
});
