const path = require("path")
const generateHtmlPlugins = require("./webpack/html-plugins")

// const ExtractTextPlugin = require("extract-text-webpack-plugin")
// const PurifyCSSPlugin = require('purifycss-webpack')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const StyleLintPlugin = require("stylelint-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const ImageminWebpackPlugin = require("imagemin-webpack-plugin").default
const ImageminWebP = require("imagemin-webp");
const SourceMapDevToolPlugin = require("webpack").SourceMapDevToolPlugin

const isProduction = process.env.NODE_ENV === "production"

module.exports = {
	mode: "development",
	entry: {
		app: "./src/js/app.js",
		search: "./src/js/search.jsx",
		cartridges: "./src/js/cartridge-finder.jsx",
		main: ["./src/css/vendor.scss", "./src/css/app.scss"]
	},
	// entry: [
	// 	"./src/js/app.js",
	// 	"./src/js/search.jsx",
	// 	"./src/css/vendor.scss", "./src/css/app.scss"
	// ],
	output: {
		path: path.resolve("dist"),
		filename: "[name].bundle.js",
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: { loader: "babel-loader", options: { presets: ["env"] } }
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["env"],
						plugins: [['transform-react-jsx', { pragma: 'h' }]]
					}
				}
			},
			{
				test: /\.js$/,
				enforce: "pre",
				exclude: /node_modules/,
				use: {
					loader: "eslint-loader",
					options: { configFile: "./.eslintrc" }
				}
			},
			{
				test: /\.(scss|css|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { sourceMap: true } },
					// { loader: "group-css-media-queries-loader", options: { sourceMap: true } },
					{
						loader: "postcss-loader",
						options: { sourceMap: true, config: { path: path.resolve(__dirname, "postcss.config.js") } }
					},
					{
						loader: "sass-loader",
						options: { outputStyle: "expanded", sourceMap: true }
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					{
						loader: "file-loader",
						options: { name: "./img/[name].[ext]" }
					},
					"img-loader",
					{
						loader: "image-webpack-loader",
						options: {
							mozjpeg: { progressive: true, quality: 65 },
							optipng: { enabled: false },
							pngquant: { quality: "65-90", speed: 4 },
							gifsicle: { interlaced: false },
							// webp: { quality: 75 }
						}
					}
				]
			},
			{ test: /\.(handlebars|hbs)$/, use: { loader: "handlebars-loader" } }
		]
	},
	optimization: {
		minimizer: []
	},
	plugins: [
		new SourceMapDevToolPlugin({}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new CleanWebpackPlugin(["dist"], {
			root: path.resolve(__dirname),
			exclude: ["/node_modules/"],
			verbose: true,
			dry: false
		}),
		new StyleLintPlugin({
			configFile: path.resolve(__dirname, "stylelint.config.js"),
			context: path.resolve(__dirname, "./src/css"),
			files: "**/*.css",
			failOnError: false,
			quiet: false
		}),
		new CopyWebpackPlugin([
			{ from: path.join(__dirname, "/src/favicon.ico"),   to: "./",  toType: "dir" },
			{ from: path.join(__dirname, "/src/web.config"),    to: "./",  toType: "dir" },
			{ from: path.join(__dirname, "/src/manifest.json"), to: "./",  toType: "dir" },
			{ from: path.join(__dirname, "/src/js/sw.js"),      to: "./",  toType: "dir" },
			{ from: path.join(__dirname, "/src/img/*.png"),     to: "./img/[name].webp", },
			{ from: path.join(__dirname, "/src/img/*.gif"),     to: "./img/[name].webp", },
			{ from: path.join(__dirname, "/src/img/*.jpg"),     to: "./img/[name].webp", },
		], { debug: "info" }),
		// new ImageminWebpackPlugin({ plugins: [ImageminWebP({ quality: 75 })] }),
	].concat(generateHtmlPlugins("./src/views"))
}

if (isProduction) {
	module.exports.optimization.minimizer.push(
		new UglifyJsPlugin({
			cache: true,
			parallel: true,
			sourceMap: true // set to true if you want JS source maps
		})
	)
	module.exports.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}))
}
