const path = require('path')
const nodeExternals = require('webpack-node-externals')

const nodeConfig = {
  target: 'node',
  entry: './src/main.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json'
            }
          },
          {
            loader: 'ifdef-loader',
            options: {
              IS_NODE: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist', 'node')
  },
  externals: [nodeExternals()],
}

const browserConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  entry: './src/main.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json'
            }
          },
          {
            loader: 'ifdef-loader',
            options: {
              IS_NODE: false
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist', 'browser')
  }
}

module.exports = [nodeConfig, browserConfig]
