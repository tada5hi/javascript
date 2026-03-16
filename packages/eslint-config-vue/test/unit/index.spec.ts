import { describe, expect, it } from 'vitest';
import eslintConfigVue from '../../src/index.ts';

describe('eslint-config-vue (deprecated wrapper)', () => {
    it('should return a valid flat config array', async () => {
        const config = await eslintConfigVue();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include vue plugin configuration', async () => {
        const config = await eslintConfigVue();
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
    });

    it('should include base config rules', async () => {
        const config = await eslintConfigVue();
        const hasBaseRules = config.some(
            (c: any) => c.rules && c.rules['@stylistic/quotes'],
        );
        expect(hasBaseRules).toBe(true);
    });
});
