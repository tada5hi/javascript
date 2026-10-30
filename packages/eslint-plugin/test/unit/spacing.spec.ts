/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import parser from '@typescript-eslint/parser';
import { Linter, RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';
import plugin from '../../src/index.ts';
import rule from '../../src/rules/lines-between-class-members.ts';

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parser } });
const options = [{
    enforce: [{
        blankLine: 'always',
        prev: 'field',
        next: '*',
    }],
}];

tester.run('lines-between-class-members', rule, {
    valid: [
        { code: 'abstract class Example { abstract first: string; }', options },
        { code: 'class Example { accessor first = 1;\n\nsecond = 2; }', options },
        { code: 'abstract class Example { abstract method(): void;\nother() {} }', options },
        { code: 'class Example { get first() {}\nset first(value) {} }', options },
        { code: 'class Example { method() {}\naccessor first = 1; }', options },
    ],
    invalid: [
        ...['abstract first: string;', 'accessor first = 1;', 'abstract accessor first: string;'].map((first) => ({
            code: `abstract class Example {\n${first}\nsecond = 2;\n}`,
            options,
            errors: [{ messageId: 'always' }],
            output: `abstract class Example {\n${first}\n\nsecond = 2;\n}`,
        })),
        {
            code: 'class Example { method() {}\nother() {} }',
            errors: [{ messageId: 'always' }],
            output: 'class Example { method() {}\n\nother() {} }',
        },
        {
            code: 'class Example { accessor first = 1;\n\nsecond = 2; }',
            options: ['never'],
            errors: [{ messageId: 'never' }],
            output: 'class Example { accessor first = 1;\nsecond = 2; }',
        },
    ],
});

it('supports ordinary JavaScript fields without a TypeScript parser', () => {
    const messages = new Linter().verify('class Example { first = 1;\nsecond = 2; }', {
        plugins: { '@tada5hi': plugin },
        rules: { '@tada5hi/lines-between-class-members': ['error', ...options] },
    });

    expect(messages.map((message) => message.ruleId)).toEqual(['@tada5hi/lines-between-class-members']);
});

it('enables property spacing in the standalone preset', () => {
    const messages = new Linter().verify('abstract class Example { abstract first: string;\nsecond = 2; }', [
        { files: ['**/*.ts'], languageOptions: { parser } },
        plugin.configs.conventions,
    ], { filename: 'src/example.ts' });

    expect(messages.map((message) => message.ruleId)).toEqual(['@tada5hi/lines-between-class-members']);
});
