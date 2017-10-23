const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const DIST_PATH = path.resolve(__dirname, './dist')

module.exports = {
  entry: {
    index: './src/track-controller.js',
    autotrack: './src/autotrack.js'
  },
  output: {
    // 打包输出的目录，这里是绝对路径，必选设置项
    path: DIST_PATH,
    // 资源基础路径
    // publicPath: '/dist',
    // 打包输出的文件名
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 指定多个loader
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(DIST_PATH),
    new CopyWebpackPlugin(['./example/demo.html'])
  ],
  devServer: {
    contentBase: DIST_PATH,
    port: 8080
  }
}
