import vue from 'eslint-plugin-vue';
import eslintConfig from '@tada5hi/eslint-config';

export default function eslintConfigVue() {
    return [
        ...eslintConfig(),
        ...vue.configs['flat/recommended'],
    ];
}
