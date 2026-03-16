import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.spec.ts'],
        testTimeout: 15000,
    },
});
