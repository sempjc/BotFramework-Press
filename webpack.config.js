// Reference:
//https://www.freecodecamp.org/news/learn-webpack-for-react-a36d4cac5060/

const path = require( 'path' );
const webpack = require( 'webpack' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require( './config.json' );

const webpackConfig = {
	mode: 'development',
	entry: [
		'./src/index.js'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve( __dirname, 'dist' ),
		publicPath: '/'
	},
	module: {
		rules: [
			// {
			// 	test: /.(sa|sc|c)ss$/,
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader',
			// 		'postcss-loader',
			// 		'sass-loader',
			// 	],
			// },
			{
				test: /.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				} 
			}
		]
	},
	devtool: 'source-map',
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.bundle.css',
		}),
		new BrowserSyncPlugin( {
				proxy: {
					target: config.proxyURL
				},
				files: [
					'**/*.php',
				],
				cors: true,
				reloadDelay: 0
			}
		)
	]
};

if ( process.env.NODE_ENV === 'production' ) {
	const buildFolder = path.resolve( __dirname, 'wp-botframework-press-plugin-built' );
	webpackConfig.plugins.push( new webpack.optimize.UglifyJsPlugin( {
		'mangle': {
			'screw_ie8': true
		},
		'compress': {
			'screw_ie8': true,
			'warnings': false
		},
		'sourceMap': false
	} ) );

	webpackConfig.plugins.push(
		new CleanWebpackPlugin( [ buildFolder ] )
	);

	webpackConfig.plugins.push(
		new CopyWebpackPlugin( [
			{ from: path.resolve( __dirname, 'server' ) + '/**', to: buildFolder },
			{ from: path.resolve( __dirname, '*.php' ), to: buildFolder }
		], {

			// By default, we only copy modified files during
			// a watch or webpack-dev-server build. Setting this
			// to `true` copies all files.
			copyUnmodified: true
		} )
	);

	webpackConfig.output.path = buildFolder + '/dist';
}

module.exports = webpackConfig;
