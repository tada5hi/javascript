const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style');

// set tab size to 4 ;)
baseStyleRules['indent'][1] = 4;

module.exports = {
    extends:  [
        '@tada5hi/eslint-config-vue',
        '@tada5hi/eslint-config-typescript'
    ],
    parser: 'vue-eslint-parser'
};
