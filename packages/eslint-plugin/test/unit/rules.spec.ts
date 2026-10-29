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
import noReexportShims from '../../src/rules/no-reexport-shims.ts';
import noRootBarrelImport from '../../src/rules/no-root-barrel-import.ts';
import typeDeclarationLocation from '../../src/rules/type-declaration-location.ts';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parser } });
const filename = '/repo/src/feature/file.ts';

tester.run('type-declaration-location', typeDeclarationLocation, {
    valid: [
        { code: 'interface Private {} type Helper = string;', filename },
        { code: 'function f() { interface Local {} type Helper = string; }', filename },
        { code: '{ type BlockLocal = string; }', filename },
        { code: 'namespace Nested { export interface Local {} }', filename },
        { code: 'declare module "external" { export interface Local {} }', filename },
        { code: 'export class Foo {}', filename },
        { code: "export type { Exported } from './types';", filename },
        { code: 'type Private = string; export { Private as Public } from "external";', filename },
        { code: 'export interface Exported {}', filename: '<input>' },
        ...['types.ts', 'types.mts', 'types.cts', 'types.tsx', 'ambient.d.ts', 'ambient.d.mts', 'ambient.d.cts'].map((name) => ({
            code: 'export interface Exported {} export type Alias = string;',
            filename: `/repo/src/${name}`,
        })),
        { code: 'export interface Exported {}', filename: 'C:\\repo\\src\\types.ts' },
    ],
    invalid: [
        'export interface Exported {}',
        'export type Exported = string;',
        'interface Exported {} export { Exported };',
        'type Exported = string; export type { Exported as Public };',
        'type Exported = string; export { type Exported };',
        'export type { Exported }; interface Exported {}',
        'export default interface Exported {}',
        'type Exported = string; export default Exported;',
        'interface Exported {} export { Exported as default };',
        'interface Exported {} export = Exported;',
        'interface Exported {} export { Exported }; export type { Exported as Other };',
    ].map((code) => ({
        code,
        filename,
        errors: [{ messageId: 'location' }],
        output: null,
    })).concat([
        {
            code: 'export type Exported = string;',
            filename: 'C:\\repo\\src\\feature\\file.ts',
            errors: [{ messageId: 'location' }],
            output: null,
        },
    ]),
});

tester.run('no-reexport-shims', noReexportShims, {
    valid: [
        ...['ts', 'js', 'mts', 'mjs', 'cts', 'cjs', 'tsx', 'jsx', 'd.ts', 'd.mts', 'd.cts'].map((extension) => ({
            code: "export { x } from './child'; export * from './nested/index'; export type * as types from './types';",
            filename: `/repo/src/index.${extension}`,
        })),
        { code: 'const x = 1; export { x };', filename },
        { code: 'declare module "external" { export { Client } from "library"; }', filename: '/repo/src/ambient.d.ts' },
        { code: 'declare module "external" { export type { Options } from "library"; }', filename },
        { code: "export * from './child/../sibling';", filename: '/repo/src/index.ts' },
        { code: "export * from './child';", filename: 'C:\\repo\\src\\nested\\index.mts' },
        { code: "export * from '../outside';", filename: '<input>' },
    ],
    invalid: [
        ...['d.ts', 'd.mts', 'd.cts'].map((extension) => ({
            code: 'export type { IClient } from "../outside";',
            filename: `/repo/src/index.${extension}`,
            errors: [{ messageId: 'subtree' }],
            output: null,
        })),
        ...['../outside', 'external', '@scope/pkg', '/absolute', './child/../../outside', './..', './nested/../../../other'].map((source) => ({
            code: `export * as x from '${source}';`,
            filename: '/repo/src/index.ts',
            errors: [{ messageId: 'subtree' }],
            output: null,
        })),
        ...["export { x } from './child';", "export type { X } from './types';", "export * from './child';"].map((code) => ({
            code,
            filename,
            errors: [{ messageId: 'barrel' }],
            output: null,
        })),
        {
            code: "export * from './child';",
            filename: '/repo/src/not-index.ts',
            errors: [{ messageId: 'barrel' }],
            output: null,
        },
    ],
});

tester.run('no-root-barrel-import', noRootBarrelImport, {
    valid: [
        ...['../feature/index.ts', '@scope/package', './nested/index.ts', './index.ts', '../other', '../index.json', '../../index.ts'].map((source) => ({
            code: `import x from '${source}';`,
            filename,
        })),
        { code: "import x from '../';", filename: '/repo/test/file.ts' },
        { code: "import x from '../';", filename: '<input>' },
        { code: 'import(`../${name}`); import(source);', filename },
        { code: 'const x = require("./index");', filename },
        { code: 'function load(require: (id: string) => unknown) { return require("../index"); }', filename },
        { code: 'const require = (id: string) => id; const x = require("../index");', filename },
        { code: 'const x = require(path);', filename },
        ...['..\\index', './..\\index'].flatMap((source) => [
            { code: `const x = require(${JSON.stringify(source)});`, filename },
            { code: `import x = require(${JSON.stringify(source)});`, filename },
            ...[
                `import x from ${JSON.stringify(source)};`,
                `import(${JSON.stringify(source)});`,
                `type X = import(${JSON.stringify(source)}).X;`,
                `function load(require: (id: string) => unknown) { return require(${JSON.stringify(source)}); }`,
            ].map((code) => ({ code, filename: 'C:\\repo\\src\\feature\\file.ts' })),
        ]),
        { code: `const x = require(${JSON.stringify('.\\index')});`, filename: 'C:\\repo\\src\\feature\\file.ts' },
        { code: "export * from '../index';", filename },
        { code: "import x from '../../index.ts';", filename: '/repo/src/nested/src/feature/file.ts' },
    ],
    invalid: [
        ...['..', '../', '../index', '../index.ts', '../index.js', '../index.mts', '../index.mjs', '../index.cts', '../index.cjs', '../index.tsx', '../index.jsx', './nested/../../index.ts', '../../src'].map((source) => ({
            code: `import x from '${source}';`,
            filename,
            errors: [{ messageId: 'root' }],
            output: null,
        })),
        ...[
            "import('..');",
            'import(`../index`);',
            "type X = import('../index').X;",
            "import type { X } from '../';",
            "const x = require('../index');",
            "import x = require('../index');",
        ].map((code) => ({
            code,
            filename,
            errors: [{ messageId: 'root' }],
            output: null,
        })),
        ...['..\\index', './..\\index'].flatMap((source) => [
            `const x = require(${JSON.stringify(source)});`,
            `import x = require(${JSON.stringify(source)});`,
        ].flatMap((code) => ['C:\\repo\\src\\feature\\file.ts', '\\\\server\\share\\repo\\src\\feature\\file.ts'].map((windowsFilename) => ({
            code,
            filename: windowsFilename,
            errors: [{ messageId: 'root' }],
            output: null,
        })))),
        {
            code: "import './index';",
            filename: '/repo/src/file.ts',
            errors: [{ messageId: 'root' }],
            output: null,
        },
        {
            code: "import '.';",
            filename: '/repo/src/file.ts',
            errors: [{ messageId: 'root' }],
            output: null,
        },
        {
            code: "import '..';",
            filename: 'C:\\repo\\src\\feature\\file.ts',
            errors: [{ messageId: 'root' }],
            output: null,
        },
        {
            code: "import '../index';",
            filename: '/repo/src/nested/src/feature/file.ts',
            errors: [{ messageId: 'root' }],
            output: null,
        },
    ],
});

it('supports JavaScript import rules without a TypeScript parser', () => {
    const messages = new Linter().verify("import '../index'; export * from './child';", {
        plugins: { '@tada5hi': plugin },
        rules: {
            '@tada5hi/no-root-barrel-import': 'error',
            '@tada5hi/no-reexport-shims': 'error',
        },
    }, { filename: 'src/feature/file.js' });
    expect(messages.map((message) => message.ruleId)).toEqual([
        '@tada5hi/no-root-barrel-import',
        '@tada5hi/no-reexport-shims',
    ]);
});

it('can combine the preset with explicit registration of the exported plugin', () => {
    expect(plugin.configs.conventions.plugins?.['@tada5hi']).toBe(plugin);
    const messages = new Linter().verify('export type Options = string;', [
        { files: ['**/*.ts'], languageOptions: { parser } },
        plugin.configs.conventions,
        { plugins: { '@tada5hi': plugin } },
    ], { filename: 'src/types.ts' });
    expect(messages).toEqual([]);
});

it('provides a source-only preset with custom rules and native ESLint compatibility', () => {
    expect(plugin.meta).toEqual({ name: '@tada5hi/eslint-plugin', version: '0.1.0' });
    expect(plugin.configs.conventions.files).toEqual(['**/src/**/*.{ts,tsx,mts,cts}']);
    const linter = new Linter();
    const config = [
        { files: ['**/*.ts'], languageOptions: { parser } },
        plugin.configs.conventions,
    ];
    const code = 'export interface Exported {}';
    expect(linter.verify(code, config, { filename: 'src/file.ts' }).map((message) => message.ruleId)).toEqual(['@tada5hi/type-declaration-location']);
    expect(linter.verify(code, config, { filename: 'test/file.ts' })).toEqual([]);
});
