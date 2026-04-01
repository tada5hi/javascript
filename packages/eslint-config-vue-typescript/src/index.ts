import type { Linter } from 'eslint';
import eslintConfig from '@tada5hi/eslint-config';

interface Options {
    project?: string | boolean;
}

/**
 * @deprecated Use `@tada5hi/eslint-config` with `{ typescript: options, vue: true }` instead.
 */
export default function eslintConfigVueTypescript(options: Options = {}): Promise<Linter.Config[]> {
    return eslintConfig({
        typescript: options,
        vue: true, 
    });
}
