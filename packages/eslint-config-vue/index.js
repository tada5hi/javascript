module.exports = {
    extends:  [
        'plugin:vue/recommended',
        '@tada5hi/eslint-config'
    ],
    plugins: [
        'vue'
    ],
    settings: {
        "import/resolver": {
            "node": {
                extensions: ['.js', '.mjs']
            }
        }
    }
};
