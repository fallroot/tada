module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'tada.js',
        library: 'Tada',
        libraryTarget: 'umd',
        path: './build'
    },
    module: {
        loaders: [
            {
                exclude: ['node_modules', 'test'],
                loader: 'babel',
                test: /\.js$/
            }
        ]
    }
};
