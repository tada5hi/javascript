import resolve from '@rollup/plugin-node-resolve';
import swc from 'unplugin-swc';
import esmShim from '@rollup/plugin-esm-shim';

import { builtinModules } from 'node:module';

const extensions = [
    '.js', '.mjs', '.cjs', '.ts', '.mts', '.cts',
];

export function createConfig(
    {
        pkg,
        pluginsPre = [],
        pluginsPost = [],
        external = [],
    },
) {
    external = Object.keys(pkg.dependencies || {})
        .concat(Object.keys(pkg.peerDependencies || {}))
        .concat(builtinModules)
        .concat(external);

    return {
        input: 'src/index.ts',
        external,
        output: [
            {
                format: 'es',
                file: pkg.module,
                sourcemap: true,
            },
        ],
        plugins: [
            ...pluginsPre,

            resolve({ extensions }),

            esmShim(),

            swc.rollup(),

            ...pluginsPost,
        ],
    };
}
