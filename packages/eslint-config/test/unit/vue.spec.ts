/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';

describe('vue rules', () => {
    it('should include vue plugin configuration', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: true, 
        });
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
    });

    it('should include base config rules', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: true, 
        });
        const hasBaseRules = config.some(
            (c: any) => c.rules && c.rules['@stylistic/quotes'],
        );
        expect(hasBaseRules).toBe(true);
    });

    it('should disable vue/multi-word-component-names', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: true, 
        });
        const hasRule = config.some(
            (c: any) => c.rules && c.rules['vue/multi-word-component-names'] === 'off',
        );
        expect(hasRule).toBe(true);
    });

    it('should enforce 4-space vue/html-indent', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: true, 
        });
        const hasRule = config.some(
            (c: any) => c.rules && Array.isArray(c.rules['vue/html-indent']) && c.rules['vue/html-indent'][1] === 4,
        );
        expect(hasRule).toBe(true);
    });
});

describe('vue + typescript rules', () => {
    it('should include both vue and typescript plugins', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: true, 
        });
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        const hasTsPlugin = config.some(
            (c: any) => c.plugins && ('@typescript-eslint' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
        expect(hasTsPlugin).toBe(true);
    });

    it('should configure typescript parser for .vue files', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: true, 
        });
        const vueFileConfig = config.find(
            (c: any) => c.files &&
                c.files.some((f: string) => f.includes('.vue')) &&
                c.languageOptions?.parserOptions?.parser,
        );
        expect(vueFileConfig).toBeDefined();
        expect(vueFileConfig!.languageOptions!.parserOptions!.extraFileExtensions).toContain('.vue');
    });
});
