const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, './index.js'),
  output: {
    filename: 'tada.js',
    library: 'Tada',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [
      {
        exclude: [
          'node_modules',
          path.resolve(__dirname, '../tests')
        ],
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
