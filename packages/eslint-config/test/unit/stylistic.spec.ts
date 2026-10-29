/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import parser from '@typescript-eslint/parser';
import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';
import { stylisticConfig } from '../../src/configs/stylistic/index.ts';

const ruleId = '@stylistic/padding-line-between-statements';
const stylistic = stylisticConfig()[0]!;
const config = [{ plugins: stylistic.plugins, rules: { [ruleId]: stylistic.rules![ruleId]! } }];
const linter = new Linter();

const classRuleId = '@stylistic/lines-between-class-members';
const classConfig = [{
    languageOptions: { parser },
    plugins: stylistic.plugins,
    rules: { [classRuleId]: stylistic.rules![classRuleId]! },
}];

describe('class property spacing', () => {
    it.each([
        ['plain', 'first = 1;', 'second = 2;'],
        ['decorated', '@Column({ type: "text" })\nfirst!: string;', '@Column()\nsecond!: string;'],
        ['static', 'static first = 1;', 'static second = 2;'],
        ['private', '#first = 1;', '#second = 2;'],
        ['typed', 'declare first: string;', 'readonly second?: string;'],
        ['multiline', 'first = {\n    value: 1,\n};', 'second = 2;'],
        ['before method', 'first = 1;', 'method() {}'],
        ['before accessor', 'first = 1;', 'get value() { return 1; }'],
        ['before static block', 'first = 1;', 'static {}'],
        ['commented', 'first = 1;', '// Second property\n@Column()\nsecond!: string;'],
    ])('autofixes %s properties without changing code', (_name, first, second) => {
        const source = `class Example {\n${first}\n${second}\n}`;
        const expected = `class Example {\n${first}\n\n${second}\n}`;
        const messages = linter.verify(source, classConfig);
        expect(messages.map((message) => message.ruleId)).toEqual([classRuleId]);

        const fixed = linter.verifyAndFix(source, classConfig);
        expect(fixed.output).toBe(expected);
        expect(fixed.messages).toEqual([]);
        expect(linter.verifyAndFix(expected, classConfig).fixed).toBe(false);
    });

    it.each([
        'class Example {\nfirst = 1;\n}',
        'class Example {\nfirst = 1;\n\nsecond = 2;\n}',
        'class Example {\nmethod() {}\nother() {}\n}',
        'class Example {\nmethod() {}\nfield = 1;\n}',
        'interface IExample {\nfirst: string;\nsecond: string;\n}',
        'type Example = {\nfirst: string;\nsecond: string;\n};',
        'const example = {\nfirst: 1,\nsecond: 2,\n};',
    ])('does not require unrelated padding in %s', (source) => {
        expect(linter.verify(source, classConfig)).toEqual([]);
    });

    it.each([
        ['src/example.js', 'class Example {\nfirst = 1;\nsecond = 2;\n}', { typescript: false }],
        ['src/example.ts', 'class Example {\nfirst!: string;\nsecond!: string;\n}', {}],
        ['src/example.vue', '<script lang="ts">\nclass Example {\nfirst!: string;\nsecond!: string;\n}\n</script>', { vue: true }],
    ])('is enabled by default in %s and can be disabled', async (filename, source, options) => {
        const defaults = await eslintConfig(options);
        const messages = linter.verify(source, defaults, { filename });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.filter((message) => message.ruleId === classRuleId)).toHaveLength(1);

        const overrides = await eslintConfig(options, { rules: { [classRuleId]: 'off' } });
        const overridden = linter.verify(source, overrides, { filename });
        expect(overridden.filter((message) => message.fatal)).toEqual([]);
        expect(overridden.filter((message) => message.ruleId === classRuleId)).toEqual([]);
    });
});

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
