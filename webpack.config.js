const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.ts',
        index: './src/nsrx.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: '.' }
            ]
        })
    ]
};