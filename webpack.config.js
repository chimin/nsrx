const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack')

module.exports = {
    entry: {
        test: './src/test.ts',
        index: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'nsrx'
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
        }),
        new DtsBundleWebpack({
            name: 'nsrx',
            main: './out/dts/src/index.d.ts',
            out: path.resolve(__dirname, 'dist/index.d.ts')
        })
    ]
};