const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const typeCompiler = require("@deepkit/type-compiler");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./packages/client/src/index.ts",
	target: "web",
	devtool: "hidden-source-map",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist/packages/client"),
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"],
		plugins: [new TsconfigPathsPlugin({ extensions: [".js", "ts"] })],
	},
	module: {
		rules: [
			// all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
			{
				test: /\.([cm]?ts|tsx)$/,
				loader: "ts-loader",
				options: {
					//this enables @deepkit/type's type compiler
					getCustomTransformers: (program, getProgram) => ({
						before: [typeCompiler.transformer],
						afterDeclarations: [typeCompiler.declarationTransformer],
					}),
				},
			},
		],
	},
	plugins: [new HtmlWebpackPlugin()],
};
