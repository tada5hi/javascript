const { rules: baseStyleRules } = require('eslint-plugin-vue/lib');

baseStyleRules['html-indent'][1] = 4;

module.exports = {
    extends:  [
        'plugin:vue/vue3-recommended',
        '@tada5hi/eslint-config'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        "vue/multi-word-component-names": "off",
        "vue/html-indent": baseStyleRules['html-indent']
    }
};
