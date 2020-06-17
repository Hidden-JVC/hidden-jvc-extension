/* eslint-env node */
const path = require('path');

module.exports = {
    entry: {
        content: './src/content/index.js',
        background: './src/background/index.js'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.handlebars$/i,
                use: 'handlebars-loader',
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 1024 * 1024,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    watchOptions: {
        ignored: /node_modules/
    }
};
