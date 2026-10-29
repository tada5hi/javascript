/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';
import { stylisticConfig } from '../../src/configs/stylistic/index.ts';

const ruleId = '@stylistic/padding-line-between-statements';
const stylistic = stylisticConfig()[0]!;
const config = [{ plugins: stylistic.plugins, rules: { [ruleId]: stylistic.rules![ruleId]! } }];
const linter = new Linter();

function verify(code: string) {
    const messages = linter.verify(code, config);
    expect(messages.filter((message) => message.fatal)).toEqual([]);

    return messages;
}

describe('control-flow statement spacing', () => {
    it.each([
        'if (ready) { work(); }',
        'if (ready) { work(); } else if (retry) { retryWork(); } else { stop(); }',
        'for (let index = 0; index < 3; index++) { work(); }',
        'for (const item of items) { work(item); }',
        'for (const key in object) { work(key); }',
        'while (ready) { work(); }',
        'do { work(); } while (ready);',
        'try { work(); } catch (error) { recover(error); } finally { close(); }',
        'switch (value) { case 1: work(); break; default: stop(); }',
    ])('requires blank lines around %s', (statement) => {
        const messages = verify(`before();\n${statement}\nafter();`);
        expect(messages.map((message) => message.ruleId)).toEqual([ruleId, ruleId]);

        const fixed = linter.verifyAndFix(`before();\n${statement}\nafter();`, config);
        expect(fixed.output).toBe(`before();\n\n${statement}\n\nafter();`);
        expect(fixed.messages).toEqual([]);
        expect(linter.verifyAndFix(fixed.output, config).fixed).toBe(false);
    });

    it('enforces nested statements at every level', () => {
        const source = 'function run() {\n    before();\n    while (ready) {\n        prepare();\n        if (valid) { work(); }\n        finish();\n    }\n    after();\n}';
        expect(verify(source)).toHaveLength(4);
    });

    it.each([
        'function run() {\n    work();\n    return value;\n}',
        'function run() {\n    work();\n    return {\n        value: 1,\n    };\n}',
        'function run() {\n    work();\n    return;\n}',
    ])('requires a blank line before every return', (source) => {
        expect(verify(source).map((message) => message.ruleId)).toEqual([ruleId]);
        expect(linter.verifyAndFix(source, config).messages).toEqual([]);
    });

    it.each([
        'function run() {\n    if (ready) {\n        work();\n    }\n}',
        'function run() {\n    return value;\n}',
        'if (ready) {\n    work();\n} else if (retry) {\n    retryWork();\n} else {\n    stop();\n}',
        'try {\n    work();\n} catch (error) {\n    recover(error);\n} finally {\n    close();\n}',
        'switch (value) {\ncase 1:\n    work();\n    break;\ndefault:\n    stop();\n}',
        'first();\nsecond();',
        'const first = 1;\nconst second = 2;',
    ])('does not add padding at block boundaries or unrelated statements', (source) => {
        expect(verify(source)).toEqual([]);
    });

    it('also separates for-await loops', () => {
        const source = 'async function run() {\n    prepare();\n    for await (const item of items) { work(item); }\n    finish();\n}';
        expect(verify(source).map((message) => message.ruleId)).toEqual([ruleId, ruleId]);
        expect(linter.verifyAndFix(source, config).messages).toEqual([]);
    });

    it('does not double-pad adjacent control-flow statements', () => {
        const source = 'while (ready) { work(); }\nif (done) { finish(); }';
        expect(linter.verifyAndFix(source, config).output).toBe('while (ready) { work(); }\n\nif (done) { finish(); }');
    });

    it('keeps explanatory comments with the following statement', () => {
        const source = 'prepare();\n// Validate before processing.\nif (ready) { work(); }';
        expect(verify(source).map((message) => message.ruleId)).toEqual([ruleId]);
        const fixed = linter.verifyAndFix(source, config);
        expect(fixed.output).toBe('prepare();\n\n// Validate before processing.\nif (ready) { work(); }');
    });

    it.each([
        ['src/example.js', 'function run() {\n    work();\n    return value;\n}'],
        ['src/example.ts', 'function run(): string {\n    work();\n    return value;\n}'],
        ['src/example.vue', '<script setup lang="ts">\nfunction run(): string {\n    work();\n    return value;\n}\n</script>'],
    ])('is enabled by default in %s', async (filename, source) => {
        const configs = await eslintConfig({ typescript: true, vue: true });
        const messages = linter.verify(source, configs, { filename });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.some((message) => message.ruleId === ruleId)).toBe(true);
    });

    it('supports individual rule overrides', async () => {
        const configs = await eslintConfig(
            { typescript: false, vue: false },
            { rules: { [ruleId]: 'off' } },
        );
        const messages = linter.verify('prepare();\nif (ready) { work(); }\nfinish();', configs);
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.filter((message) => message.ruleId === ruleId)).toEqual([]);
    });
});
