import type { Linter } from 'eslint';
import vue from 'eslint-plugin-vue';
import eslintConfig from '@tada5hi/eslint-config';

export default function eslintConfigVue(): Linter.Config[] {
    return [
        ...eslintConfig(),
        ...vue.configs['flat/recommended'] as Linter.Config[],
    ];
}
