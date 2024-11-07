const path = require('path');

module.exports = {
    mode: 'development',
    entry: './static/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    target: 'web',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 5000,
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        extensions: ['.js', '.json'],
    },
};