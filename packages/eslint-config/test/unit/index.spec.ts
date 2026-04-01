/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import eslintConfig from '../../src/index.ts';

describe('eslint-config factory', () => {
    it('should return a valid flat config array', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: false, 
        });
        expect(Array.isArray(config)).toBe(true);
        expect(config.length).toBeGreaterThan(0);
    });

    it('should include typescript configs when enabled', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: false, 
        });
        const hasTsPlugin = config.some(
            (c: any) => c.plugins && ('@typescript-eslint' in c.plugins),
        );
        expect(hasTsPlugin).toBe(true);
    });

    it('should include vue configs when enabled', async () => {
        const config = await eslintConfig({
            typescript: false,
            vue: true, 
        });
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasVuePlugin).toBe(true);
    });

    it('should include both typescript and vue configs', async () => {
        const config = await eslintConfig({
            typescript: true,
            vue: true, 
        });
        const hasTsPlugin = config.some(
            (c: any) => c.plugins && ('@typescript-eslint' in c.plugins),
        );
        const hasVuePlugin = config.some(
            (c: any) => c.plugins && ('vue' in c.plugins),
        );
        expect(hasTsPlugin).toBe(true);
        expect(hasVuePlugin).toBe(true);
    });

    it('should configure vue with typescript parser when both enabled', async () => {
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

    it('should accept typescript options object', async () => {
        const config = await eslintConfig({
            typescript: { project: './tsconfig.json' },
            vue: false, 
        });
        const hasParserOptions = config.some(
            (c: any) => c.languageOptions?.parserOptions?.project === './tsconfig.json',
        );
        expect(hasParserOptions).toBe(true);
    });

    it('should append variadic user configs', async () => {
        const config = await eslintConfig(
            {
                typescript: false,
                vue: false, 
            },
            { rules: { 'no-console': 'off' } },
        );
        const last = config[config.length - 1];
        expect((last as any).rules['no-console']).toBe('off');
    });
});
