module.exports = {
    root: true,
    env: {
        browser: true,
        webextensions: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    extends: [
        'eslint:recommended'
    ],
    rules: {
        'semi': 'warn',
        'no-unused-vars': 'warn',
        'eol-last': 'warn',
        'no-multiple-empty-lines': ['warn', { 'max': 1 }],
        'indent': ['warn', 4, { "SwitchCase": 1 }],
        'quotes': ['warn', 'single'],
        'no-case-declarations': 'off'
    }
}
