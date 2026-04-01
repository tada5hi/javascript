/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { Linter } from 'eslint';
import eslintConfig from '../../src/index.ts';

describe('javascript rules', () => {
    const linter = new Linter();

    async function getConfig() {
        return eslintConfig({
            typescript: false,
            vue: false, 
        });
    }

    it('should enforce single quotes', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = "hello";\n',
            config,
            { filename: 'test.js' },
        );
        const quoteError = messages.find((m) => m.ruleId === '@stylistic/quotes');
        expect(quoteError).toBeDefined();
    });

    it('should enforce 4-space indentation', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'function foo() {\n  return true;\n}\n',
            config,
            { filename: 'test.js' },
        );
        const indentError = messages.find((m) => m.ruleId === '@stylistic/indent');
        expect(indentError).toBeDefined();
    });

    it('should allow no-await-in-loop', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'async function foo(items) {\n    for (const item of items) {\n        await item.process();\n    }\n}\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'no-await-in-loop');
        expect(error).toBeUndefined();
    });

    it('should enforce prefer-const', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'let x = 1;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'prefer-const');
        expect(error).toBeDefined();
    });

    it('should enforce no-var', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'var x = 1;\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'no-var');
        expect(error).toBeDefined();
    });

    it('should enforce eqeqeq', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'if (x == 1) {}\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'eqeqeq');
        expect(error).toBeDefined();
    });

    it('should enforce unicorn/prefer-node-protocol', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'import fs from \'fs\';\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === 'unicorn/prefer-node-protocol');
        expect(error).toBeDefined();
    });

    it('should enforce object-curly-spacing', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = {a: 1};\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/object-curly-spacing');
        expect(error).toBeDefined();
    });

    it('should enforce padded-blocks', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'if (true) {\n\n    foo();\n}\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/padded-blocks');
        expect(error).toBeDefined();
    });

    it('should enforce object-curly-newline', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = { a: 1, b: 2, c: 3 };\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/object-curly-newline');
        expect(error).toBeDefined();
    });

    it('should enforce object-property-newline', async () => {
        const config = await getConfig();
        const messages = linter.verify(
            'const x = {\n    a: 1, b: 2,\n    c: 3,\n};\n',
            config,
            { filename: 'test.js' },
        );
        const error = messages.find((m) => m.ruleId === '@stylistic/object-property-newline');
        expect(error).toBeDefined();
    });

    it('should enforce max-len at 150 characters', async () => {
        const config = await getConfig();
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
