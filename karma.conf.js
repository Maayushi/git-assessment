var path = require("path");

module.exports = function (config) {
	config.set({
		//browsers: ["Chrome", "Firefox"], //run in Chrome
		browsers: ["PhantomJS"],//, "ChromeHeadless"], //run headless for bamboo
		customLaunchers: {
  		ChromeHeadless: {
  			base: 'Chrome',
  			flags: [
  			'--headless',
  			'--disable-gpu',
  			// Without a remote debugging port, Google Chrome exits immediately.
  			'--remote-debugging-port=9222',
  			]
  		}
		},
		singleRun: true,
		colors: true,
		basePath: "",
		frameworks: ["jasmine", "sinon"],
		preprocessors: {
			"test/**/*.test.js": ["webpack", "sourcemap"],
		},
		files: [
			{pattern: "test/**/*.test.js"}
		],
		reporters: ["mocha", "coverage"], //report results in this format
		coverageReporter: {
			reporters: [
				{
					type: "text-summary"
				},
				{
					type: "html",
					dir: "coverage"
				}
			]
		},
		webpack: {
			devtool: "inline-source-map",
			resolve: {
				extensions: [".js", ".jsx", ".css"]
			},
			module: {
				exprContextCritical: false,
				rules: [
					{
						enforce: "pre",
						test: /\.js$/,
						exclude: [path.resolve("node_modules"), path.resolve("src")],
						loaders: ["babel-loader"]
					},
					{
						enforce: "pre",
						test: /\.jsx?$/,
						exclude: path.resolve("node_modules"),
						include: path.resolve("src"),
						loaders: ["isparta-loader"]
					},
					{
						enforce: "pre",
						test: /\.css$/,
						exclude: [path.resolve("node_modules")],
						include: path.resolve("src/styles"),
						loaders: ["css-loader"]
					},
				]
			},
			externals: {
				"react/addons": true,
				"react/lib/ExecutionEnvironment": true,
				"react/lib/ReactContext": true
			}
		},
		webpackServer: {
			noInfo: true
		},
		plugins: [
			"karma-webpack",
			"karma-jasmine",
			"karma-sinon",
			"karma-coverage",
			"karma-sourcemap-loader",
			"karma-chrome-launcher",
			"karma-firefox-launcher",
			"karma-phantomjs-launcher",
			"karma-mocha-reporter"
		]
	});
};
