// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return [
    {
      mode: isDev ? "development" : "production",
      entry: "./src/electron.ts",
      target: "electron-main",
      module: {
        rules: [
          {
            test: /\.ts$/,
            include: /src/,
            resolve: {
                extensions: [".ts", ".tsx"]
            },
            use: [{ loader: "ts-loader" }]
          }
        ]
      },
      output: {
        path: __dirname + "/build",
        filename: "electron.js"
      }
    }, {
      mode: "development",
      entry: "./src/react.jsx",
      target: "electron-renderer",
      devtool: isDev ? "source-map" : "none",
      module: {
        rules: [
          {
              test: /\.(png|jpe?g|gif|ttf|woff|woff2)$/i,
              use: [{ loader: 'file-loader' }],
          }, {
              test: /\.(scss|css)$/,
              resolve: { extensions: [".css", ".scss"] },
              use: [
                  { loader: 'style-loader' },
                  { loader: 'css-loader', options: { modules: false } },
                  { loader: 'sass-loader', options: { sourceMap: isDev } }
              ]
          }, {
            test: /\.ts(x?)$/,
            include: /src/,
            resolve: {
                extensions: [".ts", ".tsx"]
            },
            use: [{ loader: "ts-loader" }]
          }, {
              test: /\.js(x?)$/,
              include: /src/,
              exclude: /node_modules/,
              resolve: {
                  extensions: [".js", ".jsx"]
              },
              use: [{
                  loader: 'babel-loader',
                  options: {
                      presets: [
                          '@babel/preset-env',
                          '@babel/preset-react'
                      ],
                      plugins: [
                          '@babel/plugin-proposal-object-rest-spread',
                          '@babel/plugin-proposal-class-properties',
                          'react-hot-loader/babel'
                      ]
                  }
              }]
          }
        ]
      },
      output: {
        path: __dirname + "/build",
        filename: "react.js"
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          hash: true
        })
      ]
    }
  ]
}
