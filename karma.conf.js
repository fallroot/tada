// Karma configuration
// Generated on Mon Apr 25 2016 23:53:37 GMT+0900 (KST)

module.exports = function(config) {
  var coverageReporter = {};
  var reporters = ['spec'];
  var webpackConfig = {
    devtool: 'inline-source-map',
    module: {
      loaders: [{
        exclude: ['node_modules', 'test'],
        loader: 'babel',
        test: /\.js$/
      }]
    }
  };

  if (config.coverage) {
    webpackConfig.module.postLoaders = [{
      test: /\.js$/,
      exclude: /(node_modules|tests)/,
      loader: 'istanbul-instrumenter'
    }];

    coverageReporter = {
      dir: 'build/.reports/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
      ]
    };

    reporters.push('coverage');
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      './tests.webpack.js',
      './tests/partials/**/*.html'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests.webpack.js': ['webpack', 'sourcemap'],
      './tests/partials/**/*.html': ['html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,


    coverageReporter: coverageReporter,


    webpack: webpackConfig,


    webpackMiddleware: {
      noInfo: true
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
