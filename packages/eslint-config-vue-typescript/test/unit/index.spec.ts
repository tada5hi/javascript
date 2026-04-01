import { describe, expect, it } from 'vitest';
import eslintConfigVueTypescript from '../../src/index.ts';

describe('eslint-config-vue-typescript (deprecated wrapper)', () => {
    it('should return a valid flat config array', async () => {
        const config = await eslintConfigVueTypescript();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include vue plugin configuration', async () => {
        const config = await eslintConfigVueTypescript();
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
    });

    it('should include typescript-eslint configuration', async () => {
        const config = await eslintConfigVueTypescript();
        const hasTsPlugin = config.some(
            (c: any) => c.plugins && ('@typescript-eslint' in c.plugins),
        );
        expect(hasTsPlugin).toBe(true);
    });

    it('should configure typescript parser for .vue files', async () => {
        const config = await eslintConfigVueTypescript();
        const vueFileConfig = config.find(
            (c: any) => c.files &&
                c.files.some((f: string) => f.includes('.vue')) &&
                c.languageOptions?.parserOptions?.parser,
        );
        expect(vueFileConfig).toBeDefined();
        expect(vueFileConfig!.languageOptions!.parserOptions!.extraFileExtensions).toContain('.vue');
    });

    it('should disable vue/multi-word-component-names', async () => {
        const config = await eslintConfigVueTypescript();
        const hasRule = config.some(
            (c: any) => c.rules && c.rules['vue/multi-word-component-names'] === 'off',
        );
        expect(hasRule).toBe(true);
    });

    it('should enforce 4-space vue/html-indent', async () => {
        const config = await eslintConfigVueTypescript();
        const hasRule = config.some(
            (c: any) => c.rules && Array.isArray(c.rules['vue/html-indent']) && c.rules['vue/html-indent'][1] === 4,
        );
        expect(hasRule).toBe(true);
    });
});
