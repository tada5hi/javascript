/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import { isObject } from 'smob';
import type {
    FactoryOptions,
    TypeScriptOptions,
    UserConfig,
    VueOptions,
} from './types.ts';
import { javascript } from './configs/javascript/index.ts';
import { stylisticConfig } from './configs/stylistic/index.ts';
import { imports } from './configs/imports/index.ts';
import { unicorn } from './configs/unicorn/index.ts';
import { isPackageExists } from './utils.ts';

export async function eslintConfig(
    options: FactoryOptions = {},
    ...userConfigs: UserConfig[]
): Promise<Linter.Config[]> {
    const configs: Linter.Config[] = [
        ...javascript(),
        ...stylisticConfig(),
        ...imports(),
        ...unicorn(),
    ];

    const enableTypescript = resolveEnabled(options.typescript, 'typescript');
    const enableVue = resolveEnabled(options.vue, 'vue');

    if (enableTypescript) {
        const tsOptions: TypeScriptOptions = isObject(options.typescript) ?
            options.typescript :
            {};

        const { typescript } = await import('./configs/typescript/index.ts');
        configs.push(...await typescript(tsOptions));
    }

    if (enableVue) {
        const vueOptions: VueOptions = isObject(options.vue) ?
            { ...options.vue } :
            {};

        if (enableTypescript && !vueOptions.typescript) {
            vueOptions.typescript = true;
        }

        const { vue } = await import('./configs/vue/index.ts');
        configs.push(...await vue(vueOptions));
    }

    configs.push(...userConfigs);

    return configs;
}

function resolveEnabled(
    option: boolean | object | undefined,
    packageName: string,
): boolean {
    if (typeof option === 'boolean') {
        return option;
    }

    if (isObject(option)) {
        return true;
    }

    return isPackageExists(packageName);
}
