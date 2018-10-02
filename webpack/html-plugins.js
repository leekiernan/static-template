const fs = require('fs')
const path = require("path")

const HtmlWebpackPlugin = require('html-webpack-plugin')

const generateHtmlPlugins = (templateDir) => {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, '..', templateDir))

  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, '..', `${templateDir}/${name}.${extension}`),
      inject: true
    })
  })
}

module.exports = generateHtmlPlugins
