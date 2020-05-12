module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    rules: {
        'semi': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'comma-dangle': ['warn', 'never'],
        'indent': ['warn', 4, { 'SwitchCase': 1 }],
        'quotes': ['warn', 'single']
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
