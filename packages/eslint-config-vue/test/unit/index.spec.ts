import { describe, expect, it } from 'vitest';
import eslintConfigVue from '../../index.js';

describe('eslint-config-vue', () => {
    it('should return a valid flat config array', () => {
        const config = eslintConfigVue();
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include vue plugin configuration', () => {
        const config = eslintConfigVue();
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
    });

    it('should include base config rules', () => {
        const config = eslintConfigVue();
        const hasBaseRules = config.some(
            (c: any) => c.rules && c.rules['@stylistic/quotes'],
        );
        expect(hasBaseRules).toBe(true);
    });
});
