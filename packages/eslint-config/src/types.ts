/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Linter } from 'eslint';
import type { AgentDocsOptions } from './configs/agent-docs/types.ts';
import type { TypeScriptOptions } from './configs/typescript/types.ts';
import type { VueOptions } from './configs/vue/types.ts';

export type FactoryOptions = {
    typescript?: boolean | TypeScriptOptions;
    vue?: boolean | VueOptions;
    /**
     * Size and history checks for agent documents (CLAUDE.md, AGENTS.md,
     * .agents/**). Enabled by default; matches nothing in a project without them.
     */
    agentDocs?: boolean | AgentDocsOptions;
};

export type UserConfig = Linter.Config;
