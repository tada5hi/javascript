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

    const agentDocsOptions = isObject(options.agentDocs) ? options.agentDocs : {};

    if (options.agentDocs !== false) {
        configs.push(...agentDocs(agentDocsOptions));
    }

    // User configs come last, so they can override any built-in rule.
    configs.push(...userConfigs);

    if (options.agentDocs !== false) {
        const agentDocFiles = [
            ...(agentDocsOptions.files ?? AGENT_DOCS_FILES),
            ...(agentDocsOptions.rootFiles ?? AGENT_DOCS_ROOT_FILES),
        ];

        // A block without `files` applies to every linted file, and ESLint
        // refuses a JavaScript rule on Markdown (or a rule whose plugin only a
        // code block registers). Keep every such block, built-in or user, off
        // the agent docs only, so every other file is linted exactly as
        // before; a global ignore (only `ignores`) stays global, and the
        // agent-docs blocks carry their own `files`.
        // Rules of the agent docs themselves (`@tada5hi/agent-docs-*`,
        // `markdown/*`) stay global, so a files-less override of them still
        // reaches the agent docs; they keep the block's own `ignores`.
        const output: Linter.Config[] = [];

        for (const config of configs) {
            if (config.files || isGlobalIgnore(config)) {
                output.push(config);

                continue;
            }

            const { docRules, otherRules } = partitionRules(config.rules);
            const onlyDocRules = Object.keys(config).every((key) => key === 'name' || key === 'rules') &&
                Object.keys(otherRules).length === 0;

            if (onlyDocRules) {
                output.push(config);

                continue;
            }

            // Plugin presets may be frozen: copy rather than mutate.
            output.push({
                ...config,
                ...(config.rules ? { rules: otherRules } : {}),
                ignores: [...(config.ignores ?? []), ...agentDocFiles],
            });

            if (Object.keys(docRules).length > 0) {
                output.push({
                    ...(config.name ? { name: `${config.name}/agent-docs` } : {}),
                    ...(config.basePath ? { basePath: config.basePath } : {}),
                    ...(config.ignores ? { ignores: config.ignores } : {}),
                    rules: docRules,
                });
            }
        }

        return output;
    }

    return configs;
}

function isAgentDocRule(name: string): boolean {
    return name.startsWith('@tada5hi/agent-docs-') || name.startsWith('markdown/');
}

function partitionRules(rules: Linter.Config['rules'] = {}) {
    const docRules: NonNullable<Linter.Config['rules']> = {};
    const otherRules: NonNullable<Linter.Config['rules']> = {};

    for (const [name, value] of Object.entries(rules)) {
        if (value === undefined) {
            continue;
        }

        if (isAgentDocRule(name)) {
            docRules[name] = value;
        } else {
            otherRules[name] = value;
        }
    }

    return { docRules, otherRules };
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
