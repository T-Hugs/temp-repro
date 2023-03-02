// This file has a .cjs extension because the nx webpack executor does not support importing esm

const typeCompiler = require("@deepkit/type-compiler");
const tsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { composePlugins, withNx, withWeb } = require("@nrwl/webpack");
const path = require("path");

module.exports = composePlugins(
	withNx(),
	withWeb(),
	// withReact({ svgr: false }),
	(config, { options: nrwlOptions, context: nrwlContext }) => {
		config.module.rules
			.filter((rule) => rule.loader?.includes("ts-loader"))
			.forEach((tsRule) => {
				tsRule.options.getCustomTransformers = addDeepkitTransformer(tsRule.options.getCustomTransformers);
			});

		config.module.rules.push({
			test: /\.(md)$/,
			type: "asset/resource",
		});

		if (!config.resolve.plugins) {
			config.resolve.plugins = [];
		}
		config.resolve.plugins.push(
			new tsconfigPathsPlugin({
				extensions: [".js", ".ts"],
				configFile: path.resolve(__dirname, "packages/client/tsconfig.json"),
			}),
		);

		if (!config.resolve) {
			config.resolve = {};
		}
		if (!config.resolve.extensionAlias) {
			config.resolve.extensionAlias = {};
		}
		config.resolve.extensionAlias[".js"] = [".js", ".jsx", ".ts", ".tsx"];

		// Print configuration to console
		// console.dir(config, { depth: null });

		return config;
	},
);

// this enables @deepkit/type's type compiler
function addDeepkitTransformer(prevGetCustomTransformers) {
	return (program) => {
		const customTransformers = { ...(prevGetCustomTransformers ? prevGetCustomTransformers(program) : undefined) };
		customTransformers.before = [...(customTransformers.before || []), typeCompiler.transformer];
		customTransformers.afterDeclarations = [
			...(customTransformers.afterDeclarations || []),
			typeCompiler.declarationTransformer,
		];
		// console.log(customTransformers);
		return customTransformers;
	};
}
