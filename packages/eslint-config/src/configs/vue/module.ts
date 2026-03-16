/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import type { VueOptions } from './types.ts';

export async function vue(options: VueOptions = {}): Promise<Linter.Config[]> {
    const vuePlugin = await import('eslint-plugin-vue');

    const configs: Linter.Config[] = [
        ...vuePlugin.default.configs['flat/recommended'] as Linter.Config[],
    ];

    if (options.typescript) {
        const tseslint = await import('typescript-eslint');

        configs.push({
            files: ['**/*.vue'],
            languageOptions: {
                parserOptions: {
                    parser: tseslint.default.parser,
                    extraFileExtensions: ['.vue'],
                },
            },
        });
    }

    configs.push({
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/html-indent': ['error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            }],
            'vue/no-template-shadow': 'off',
            'vue/require-default-prop': 'off',
        },
    });

    return configs;
}
