/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import parser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import noCollectionCallInCondition from '../../src/rules/no-collection-call-in-condition.ts';

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester();
const typescriptTester = new RuleTester({ languageOptions: { parser } });
const methods = ['map', 'filter', 'flatMap', 'some', 'every', 'find', 'findIndex', 'findLast', 'findLastIndex', 'reduce', 'reduceRight'];
const error = (method = 'some') => ({
    messageId: 'condition',
    data: { method },
});

tester.run('no-collection-call-in-condition', noCollectionCallInCondition, {
    valid: [
        ...methods.map((method) => `const result = items.${method}(predicate); if (result) {}`),
        ...['includes', 'has', 'startsWith', 'endsWith', 'Some'].map((method) => `if (items.${method}(value)) {}`),
        'if (some(items, predicate)) {}',
        'if (isReady(items)) {}',
        'if (items.some) {}',
        'if (class { field = items.some(predicate); }) {}',
        'if (class { field = [items.filter(predicate)]; }) {}',
        'if (items[method](predicate)) {}',
        'if (items["so" + "me"](predicate)) {}',
        'if (items[`some${suffix}`](predicate)) {}',
        'items.some(predicate);',
        'const value = ready ? items.some(predicate) : items.every(predicate);',
        'if (ready) { items.some(predicate); } else { items.every(predicate); }',
        'while (ready) { items.some(predicate); }',
        'do { items.some(predicate); } while (ready);',
        'for (items.some(predicate); ready; items.every(predicate)) {}',
        'for (const item of items.filter(predicate)) {}',
        'for (const key in items.filter(predicate)) {}',
        'switch (items.some(predicate)) { case items.every(predicate): break; }',
        'if (register(() => items.some(predicate))) {}',
        'if (register(function () { return items.some(predicate); })) {}',
        'if (() => items.some(predicate)) {}',
        // Function bodies are skipped even when the function is immediately invoked.
        'if ((() => items.some(predicate))()) {}',
        'if ((function () { return items.some(predicate); })()) {}',
        'if ({ check() { return items.some(predicate); } }) {}',
        'if (register((value = items.some(predicate)) => value)) {}',
    ],
    invalid: [
        { code: 'if (class { static field = items.some(predicate); }) {}', errors: [error()] },
        { code: 'if (class { [items.some(predicate)] = true; }) {}', errors: [error()] },
        ...methods.map((method) => ({
            code: `if (items.${method}(predicate)) {}`,
            errors: [error(method)],
            output: null,
        })),
        ...[
            'while (items.some(predicate)) {}',
            'do {} while (items.some(predicate));',
            'for (; items.some(predicate);) {}',
            'const value = items.some(predicate) ? yes : no;',
            'if (!items.some(predicate)) {}',
            'if (ready && items.some(predicate)) {}',
            'if (ready || items.some(predicate)) {}',
            'if (ready ?? items.some(predicate)) {}',
            'if (items.some(predicate) === true) {}',
            'if ((ignored(), items.some(predicate))) {}',
            'if (validate(items.some(predicate))) {}',
            'if (await items.some(predicate)) {}',
            'if ((items.some(predicate))) {}',
            'if (items?.some(predicate)) {}',
            'if (items.some?.(predicate)) {}',
            'if (items?.some?.(predicate)) {}',
            'if (items["some"](predicate)) {}',
            'if (items?.["some"]?.(predicate)) {}',
            'if (items[`some`](predicate)) {}',
            'if (items?.[`some`]?.(predicate)) {}',
            'if (ready ? items.some(predicate) : false) {}',
            'if (ready ? false : items.some(predicate)) {}',
            'if (items.some(predicate) ? yes : no) {}',
            'if (Array.some(predicate)) {}',
            'function check() { if (items.some(predicate)) {} }',
            'register(() => { if (items.some(predicate)) {} });',
            'if (register(() => { if (items.some(predicate)) {} })) {}',
            'if (items.some(item => other.every(predicate))) {}',
            'if (items.some(function () { return other.every(predicate); })) {}',
        ].map((code) => ({
            code,
            errors: [error()],
            output: null,
        })),
        {
            code: 'if (items.filter(predicate).some(predicate)) {}',
            errors: [{ messageId: 'condition' }, { messageId: 'condition' }],
            output: null,
        },
        {
            code: 'if (items.some(predicate) && other.every(predicate)) {}',
            errors: [error(), error('every')],
            output: null,
        },
        {
            code: 'if (items.some(item => other.every(predicate) ? yes : no)) {}',
            errors: [error(), error('every')],
            output: null,
        },
        {
            code: 'const value = ready ? items.some(predicate) : other.every(predicate) ? yes : no;',
            errors: [error('every')],
            output: null,
        },
    ],
});

typescriptTester.run('no-collection-call-in-condition (TypeScript)', noCollectionCallInCondition, {
    valid: [
        'const result = items.some(predicate) as boolean; if (result) {}',
        'if ((() => items.some(predicate)) satisfies Function) {}',
        'const value = ready ? items.some(predicate)! : false;',
    ],
    invalid: [
        'if (items.some(predicate) as boolean) {}',
        'if (<boolean>items.some(predicate)) {}',
        'if (items.some(predicate)!) {}',
        'if (items.some(predicate) satisfies boolean) {}',
        'if ((items as Item[]).some(predicate)) {}',
        'if (items.some<Item>(predicate)) {}',
        'if (items!.some(predicate)) {}',
        'if (items?.["some"]?.(predicate) as boolean) {}',
    ].map((code) => ({
        code,
        errors: [error()],
        output: null,
    })),
});
