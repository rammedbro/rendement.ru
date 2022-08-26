module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended',
        'plugin:vue/recommended',
    ],
    // add your custom rules here
    rules: {
        /* JS Rules */
        'no-console': 'off',
        'indent': 'off',
        'indent-legacy': [
            'error', 4, {
                'SwitchCase': 1,
            },
        ],
        'semi': [ 'error', 'always' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'space-before-function-paren': [ 'error', 'never' ],
        'space-in-parens': [ 'error', 'always' ],
        'no-multi-spaces': [
            'error', {
                exceptions: {
                    'VariableDeclarator': true,
                    'ImportDeclaration': true,
                    'ExportNamedDeclaration': true,
                },
            },
        ],
        'eol-last': 'off',
        'no-multiple-empty-lines': [ 'error', { 'max': 2, 'maxEOF': 1, 'maxBOF': 0 } ],
        'curly': [ 'error', 'multi-line' ],
        'quotes': 'off',
        'no-trailing-spaces': [
            'error', {
                'ignoreComments': true,
                'skipBlankLines': true,
            },
        ],
        'arrow-parens': [ 'error', 'as-needed' ],
        'template-curly-spacing': [ 'error', 'always' ],
        /* TODO: Включить после создания своего класса ошибок */
        'prefer-promise-reject-errors': 'off',

        /* Vue Rules */
        'vue/script-indent': [
            'error',
            4,
            { 'baseIndent': 1, 'switchCase': 1, 'ignores': [ 'ConditionalExpression' ] },
        ],
        'vue/html-indent': [ 'error', 4 ],
        'vue/html-closing-bracket-spacing': [ 'error', { 'selfClosingTag': 'never' } ],
        'vue/max-attributes-per-line': [
            'error', {
                'singleline': 3,
                'multiline': {
                    'max': 3,
                    'allowFirstLine': true,
                },
            },
        ],
        'vue/html-closing-bracket-newline': [
            'error', {
                'multiline': 'never',
            },
        ],
        'vue/multiline-html-element-content-newline': [
            'error', {
                'allowEmptyLines': true,
            },
        ],
        'vue/singleline-html-element-content-newline': [
            'error', {
                'ignores': [ 'template' ],
            },
        ],
        'vue/no-v-html': 'off',
        'vue/html-self-closing': [
            'error', {
                'html': {
                    'void': 'never',
                    'normal': 'never',
                    'component': 'always',
                },
            },
        ],
        'vue/order-in-components': [
            'error', {
                'order': [
                    'el',
                    'name',
                    'components',
                    'props',
                    'head',
                    'data',
                    'computed',
                    'fetch',
                    'asyncData',
                    'watch',
                    'LIFECYCLE_HOOKS',
                    'methods',
                ],
            },
        ],
    },
};
