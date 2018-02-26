const path = require('path');

const config = {
  entry: path.join(__dirname , 'src', 'schedule-job.js'),
  output: {
    path: __dirname,
    filename: 'index.js'
  },
  mode: 'production',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};

module.exports = config;