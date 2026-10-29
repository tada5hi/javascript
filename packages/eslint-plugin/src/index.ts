/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ESLint, Linter } from 'eslint';
import noCollectionCallInCondition from './rules/no-collection-call-in-condition.ts';
import noReexportShims from './rules/no-reexport-shims.ts';
import noRootBarrelImport from './rules/no-root-barrel-import.ts';
import typeDeclarationLocation from './rules/type-declaration-location.ts';

// TypeScript AST visitors are compatible at runtime; expose ESLint's native plugin types to consumers.
const rules = {
    'no-collection-call-in-condition': noCollectionCallInCondition,
    'type-declaration-location': typeDeclarationLocation,
    'no-reexport-shims': noReexportShims,
    'no-root-barrel-import': noRootBarrelImport,
} as unknown as NonNullable<ESLint.Plugin['rules']>;

const plugin: ESLint.Plugin & { configs: { conventions: Linter.Config } } = {
    meta: {
        name: '@tada5hi/eslint-plugin',
        version: '0.1.0',
    },
    rules,
    configs: { conventions: {} },
};

plugin.configs.conventions = {
    name: 'tada5hi/conventions',
    files: ['**/src/**/*.{ts,tsx,mts,cts}'],
    plugins: { '@tada5hi': plugin },
    rules: {
        '@tada5hi/no-collection-call-in-condition': 'error',
        '@tada5hi/type-declaration-location': 'error',
        '@tada5hi/no-reexport-shims': 'error',
        '@tada5hi/no-root-barrel-import': 'error',
    },
};

export { rules };
export const { configs }: { configs: { conventions: Linter.Config } } = plugin;

export default plugin;
