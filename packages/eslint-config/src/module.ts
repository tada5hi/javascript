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
import {
    AGENT_DOCS_FILES,
    AGENT_DOCS_ROOT_FILES,
    agentDocs,
} from './configs/agent-docs/index.ts';
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

    if (options.agentDocs !== false) {
        const agentDocsOptions = isObject(options.agentDocs) ? options.agentDocs : {};
        const agentDocFiles = [
            ...(agentDocsOptions.files ?? AGENT_DOCS_FILES),
            ...(agentDocsOptions.rootFiles ?? AGENT_DOCS_ROOT_FILES),
        ];

        // A block without `files` applies to every linted file, and ESLint
        // refuses a JavaScript rule on Markdown. Keep the built-in blocks off
        // the agent docs only, so every other file is linted exactly as before;
        // a global ignore (only `ignores`) stays global.
        for (const [index, config] of configs.entries()) {
            if (!config.files && !isGlobalIgnore(config)) {
                // Plugin presets may be frozen: copy rather than mutate.
                configs[index] = {
                    ...config,
                    ignores: [...(config.ignores ?? []), ...agentDocFiles],
                };
            }
        }

        configs.push(...agentDocs(agentDocsOptions));
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
