/* eslint-env node */
const path = require('path');

const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
    const isProduction = env.NODE_ENV === 'production';
    const envPath = isProduction ? '.env' : '.env.example';

    return {
        entry: {
            content: './src/content/index.js',
            background: './src/background/index.js'
        },
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, '../build/extension'),
            filename: '[name].js'
        },
        plugins: [
            new Dotenv({ path: envPath })
        ],
        module: {
            rules: [
                {
                    test: /\.handlebars$/i,
                    loader: 'handlebars-loader',
                    options: {
                        helperDirs: path.join(__dirname, '../src/content/views/helpers')
                    }
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1024 * 1024 * 1024,
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        watchOptions: {
            ignored: /node_modules/
        }
    };
};
