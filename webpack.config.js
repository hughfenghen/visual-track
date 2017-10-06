const path = require('path')

const DIST_PATH = path.resolve(__dirname, './dist')

module.exports = {
  entry: {
    index: './src/track-controller.js',
  },
  output: {
    // 打包输出的目录，这里是绝对路径，必选设置项
    path: DIST_PATH,
    // 资源基础路径
    // publicPath: '/dist',
    // 打包输出的文件名
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 指定多个loader
        use: [
          'css-loader',
          'style-loader'
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      }
    ]
  },
  devServer: {
    contentBase: DIST_PATH,
    port: 8080,
  }
}
