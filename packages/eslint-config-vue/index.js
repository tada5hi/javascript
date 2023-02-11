module.exports = {
    extends:  [
        'plugin:vue/recommended',
        '@tada5hi/eslint-config'
    ],
    plugins: [
        'vue'
    ],
    parser: 'vue-eslint-parser',
    settings: {
        "import/resolver": {
            "node": {
                extensions: ['.js', '.mjs']
            }
        }
    }
};
