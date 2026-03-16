import type { Linter } from 'eslint';
import eslintConfig from '@tada5hi/eslint-config';

/**
 * @deprecated Use `@tada5hi/eslint-config` with `{ vue: true }` instead.
 */
export default function eslintConfigVue(): Promise<Linter.Config[]> {
    return eslintConfig({ typescript: false, vue: true });
}
