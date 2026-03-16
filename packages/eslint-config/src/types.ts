/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import type { TypeScriptOptions } from './configs/typescript/types.ts';
import type { VueOptions } from './configs/vue/types.ts';

export type { TypeScriptOptions } from './configs/typescript/index.ts';
export type { VueOptions } from './configs/vue/index.ts';

export interface FactoryOptions {
    typescript?: boolean | TypeScriptOptions;
    vue?: boolean | VueOptions;
}

export type UserConfig = Linter.Config;
