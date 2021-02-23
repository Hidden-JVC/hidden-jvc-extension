/* eslint-env node */
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const header = fs.readFileSync(path.join(__dirname, '../userscript.js'));

module.exports = (env) => {
    const isProduction = env.NODE_ENV === 'production';
    const envPath = isProduction ? '.env' : '.env.example';

    return {
        entry: './src/content/index.js',
        output: {
            path: path.join(__dirname, '../build/userscript'),
            filename: 'hidden-jvc.user.js'
        },
        optimization: {
            minimize: false
        },
        plugins: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    ecma: 6,
                },
            }),
            new Dotenv({
                path: envPath,
                secure: isProduction
            }),
            new WrapperPlugin({
                test: /\.user\.js$/, // only wrap output of bundle files with '.js' extension 
                header
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    HIDDEN_ENV: JSON.stringify(env.HIDDEN_ENV)
                }
            })
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
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
    };
};
