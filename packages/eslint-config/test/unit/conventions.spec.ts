/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';

const namingRule = '@typescript-eslint/naming-convention';
const locationRule = '@tada5hi/type-declaration-location';

async function verify(code: string, filename = 'src/types.ts', options = {}) {
    const config = await eslintConfig({
        typescript: true,
        vue: false,
        ...options,
    });
    const messages = new Linter().verify(code, config, { filename });
    expect(messages.filter((message) => message.fatal)).toEqual([]);

    return messages;
}

describe('default convention rules', () => {
    it.each(['ts', 'tsx', 'mts', 'cts'])('enforces interface prefixes in .%s without type information', async (extension) => {
        const messages = await verify('export interface Options { value: string }', `src/types.${extension}`);
        expect(messages.some((message) => message.ruleId === namingRule)).toBe(true);
    });

    it.each(['IClient', 'IIdentity', 'IInput'])('allows interface %s', async (name) => {
        const messages = await verify(`export interface ${name} { value: string }`);
        expect(messages.filter((message) => message.ruleId === namingRule)).toEqual([]);
    });

    it.each(['Client', 'Identity', 'Input', 'Options'])('allows alias %s without banning ordinary I words', async (name) => {
        const messages = await verify(`export type ${name} = { value: string };`);
        expect(messages.filter((message) => message.ruleId === namingRule)).toEqual([]);
    });

    it('rejects interface-style type alias names', async () => {
        const messages = await verify('export type IOptions = { value: string };');
        expect(messages.some((message) => message.ruleId === namingRule)).toBe(true);
    });

    it.each(['ts', 'mts', 'cts'])('allows external interface augmentation in .d.%s files', async (extension) => {
        const messages = await verify('declare global { interface Window { app: string } } export {};', `src/global.d.${extension}`);
        expect(messages.filter((message) => [namingRule, locationRule].includes(message.ruleId || ''))).toEqual([]);
    });

    it('allows Hub-style data interfaces without enforcing Authup-only contracts', async () => {
        const messages = await verify('export interface IEntity { name: string }');
        expect(messages.filter((message) => message.ruleId === namingRule)).toEqual([]);
    });

    it('does not impose unrelated naming policies on properties or enums', async () => {
        const messages = await verify(`
export type Input = { external_key: string };
export enum Status { pending = 'pending' }
`);
        expect(messages.filter((message) => message.ruleId === namingRule)).toEqual([]);
    });

    it('enforces module boundaries for source files', async () => {
        const messages = await verify('export type Options = { value: string };', 'src/client/module.ts');
        expect(messages.some((message) => message.ruleId === locationRule)).toBe(true);
    });

    it('enforces root-barrel import boundaries through the factory', async () => {
        const messages = await verify('import { client } from \'../index.ts\';', 'src/client/module.ts');
        expect(messages.some((message) => message.ruleId === '@tada5hi/no-root-barrel-import')).toBe(true);
    });

    it('allows folder barrels to compose their own modules', async () => {
        const messages = await verify('export type { IClient } from \'./types.ts\';', 'src/client/index.ts');
        expect(messages.filter((message) => message.ruleId?.startsWith('@tada5hi/'))).toEqual([]);
    });

    it('does not enforce source layout on tests or build configs', async () => {
        const messages = await verify('export type Options = { value: string };', 'test/helpers.ts');
        expect(messages.filter((message) => message.ruleId === locationRule)).toEqual([]);
    });

    it('enforces naming and source layout by default', async () => {
        const config = await eslintConfig({ typescript: true, vue: false });
        const messages = new Linter().verify('export interface Options { value: string }', config, { filename: 'src/module.ts' });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.some((message) => message.ruleId === namingRule)).toBe(true);
        expect(messages.some((message) => message.ruleId === locationRule)).toBe(true);
    });

    it('does not require TypeScript for JavaScript module rules', async () => {
        const messages = await verify('export { client } from \'./module.js\';', 'src/client/shim.js', { typescript: false });
        expect(messages.some((message) => message.ruleId === '@tada5hi/no-reexport-shims')).toBe(true);
    });

    it('allows consumer overrides', async () => {
        const config = await eslintConfig(
            {
                typescript: true,
                vue: false,
            },
            { rules: { [namingRule]: 'off', [locationRule]: 'off' } },
        );
        const messages = new Linter().verify('export interface Options { value: string }', config, { filename: 'src/module.ts' });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.filter((message) => [namingRule, locationRule].includes(message.ruleId || ''))).toEqual([]);
    });

    it.each([
        [namingRule, 'export interface Options { value: string }', 'src/types.ts'],
        [locationRule, 'export type Options = string;', 'src/client/module.ts'],
        ['@tada5hi/no-reexport-shims', 'export { client } from \'./module.ts\';', 'src/client/shim.ts'],
        ['@tada5hi/no-root-barrel-import', 'import { client } from \'../index.ts\';', 'src/client/module.ts'],
    ])('allows disabling %s individually', async (ruleId, code, filename) => {
        const config = await eslintConfig(
            { typescript: true, vue: false },
            { rules: { [ruleId]: 'off' } },
        );
        const messages = new Linter().verify(code, config, { filename });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.filter((message) => message.ruleId === ruleId)).toEqual([]);
    });

    it.each([
        ['test/example.js', 'if (items.some(isReady)) { work(); }', { typescript: false }],
        ['src/example.ts', 'if (items.filter(isReady).length > 0) { work(); }', {}],
        ['src/example.vue', '<script setup lang="ts">\nif (items.some(isReady)) { work(); }\n</script>', { vue: true }],
    ])('enforces collection-condition readability by default in %s', async (filename, source, options) => {
        const messages = await verify(source, filename, options);
        expect(messages.some((message) => message.ruleId === '@tada5hi/no-collection-call-in-condition')).toBe(true);
    });

    it('allows disabling collection-condition readability individually', async () => {
        const config = await eslintConfig(
            { typescript: false, vue: false },
            { rules: { '@tada5hi/no-collection-call-in-condition': 'off' } },
        );
        const messages = new Linter().verify('if (items.some(isReady)) { work(); }', config, { filename: 'src/example.js' });
        expect(messages.filter((message) => message.fatal)).toEqual([]);
        expect(messages.filter((message) => message.ruleId === '@tada5hi/no-collection-call-in-condition')).toEqual([]);
    });

    it('enforces naming inside Vue TypeScript scripts without enforcing types.ts layout', async () => {
        const messages = await verify('<script setup lang="ts">\ninterface Options { value: string }\n</script>', 'src/component.vue', { vue: true });
        expect(messages.some((message) => message.ruleId === namingRule)).toBe(true);
        expect(messages.filter((message) => message.ruleId === locationRule)).toEqual([]);
    });

    it('does not load TypeScript naming rules for JavaScript-only Vue', async () => {
        const messages = await verify('<script setup>\nconst value = 1;\n</script>', 'src/component.vue', {
            typescript: false,
            vue: true,
        });
        expect(messages.filter((message) => message.ruleId === namingRule)).toEqual([]);
    });
});
