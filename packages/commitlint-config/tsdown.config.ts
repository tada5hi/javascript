import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    shims: true,
    dts: true,
    clean: true,
    hash: false,
    tsconfig: './tsconfig.build.json',
});
