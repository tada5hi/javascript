/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { eslintConfig } from './module.ts';

export type {
    FactoryOptions,
    UserConfig,
} from './types.ts';
export type { TypeScriptOptions } from './configs/typescript/index.ts';
export type { VueOptions } from './configs/vue/index.ts';

export default eslintConfig;
