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
    UserConfig,
} from './types.ts';
import type { TypeScriptOptions } from './configs/typescript/types.ts';
import type { VueOptions } from './configs/vue/types.ts';
import { javascript } from './configs/javascript/index.ts';
import { stylisticConfig } from './configs/stylistic/index.ts';
import { imports } from './configs/imports/index.ts';
import { unicorn } from './configs/unicorn/index.ts';
import { conventions } from './configs/conventions/index.ts';
import { agentDocs } from './configs/agent-docs/index.ts';
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

    configs.push(...conventions(enableTypescript, enableVue));

    // A block without `files` applies to every linted file, other languages
    // included, and ESLint refuses a JavaScript rule on Markdown. Scope the
    // built-in blocks to code; a global ignore (only `ignores`) stays global.
    // Only the enabled languages: a `.vue` glob in a project without the vue
    // option would hand Vue files to the JavaScript parser.
    const codeFiles = [
        '**/*.{js,jsx,mjs,cjs}',
        ...(enableTypescript ? ['**/*.{ts,tsx,mts,cts}'] : []),
        ...(enableVue ? ['**/*.vue'] : []),
    ];

    for (const [index, config] of configs.entries()) {
        if (!config.files && !isGlobalIgnore(config)) {
            // Plugin presets may be frozen: copy rather than mutate.
            configs[index] = { ...config, files: codeFiles };
        }
    }

    if (options.agentDocs !== false) {
        configs.push(...agentDocs(isObject(options.agentDocs) ? options.agentDocs : {}));
    }

    configs.push(...userConfigs);

    return configs;
}

function isGlobalIgnore(config: Linter.Config): boolean {
    return Object.keys(config).every((key) => key === 'ignores' || key === 'name');
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
