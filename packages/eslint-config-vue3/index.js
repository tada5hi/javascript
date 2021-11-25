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
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }]
    }
};
