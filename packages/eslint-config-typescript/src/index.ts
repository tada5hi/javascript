import type { Linter } from 'eslint';
import eslintConfig from '@tada5hi/eslint-config';

interface Options {
    project?: string | boolean;
}

/**
 * @deprecated Use `@tada5hi/eslint-config` with `{ typescript: options }` instead.
 */
export default function eslintConfigTypescript(options: Options = {}): Promise<Linter.Config[]> {
    return eslintConfig({
        typescript: options,
        vue: false 
    });
}
