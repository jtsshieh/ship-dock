const webpack = require('webpack');

const SwaggerPluginOptions = {
	dtoFileNameSuffix: ['.dto.ts', '.entity.ts', '.view.ts'],
	classValidatorShim: true,
	introspectComments: true,
};

module.exports = (config, _context) => {
	config.module.rules
		.filter((rule) => rule.loader.includes('ts-loader'))
		.forEach((tsRule) => {
			tsRule.options = { ...tsRule.options };
			tsRule.options.transpileOnly = false;
			tsRule.options.getCustomTransformers = addSwaggerPluginTransformer(
				tsRule.options.getCustomTransformers
			);
		});

	config.plugins = [
		...(config.plugins || []),
		new webpack.ProvidePlugin({
			openapi: '@nestjs/swagger',
		}),
	];
	return config;
};

function addSwaggerPluginTransformer(prevGetCustomTransformers) {
	return (program) => {
		const customTransformers = {
			...(prevGetCustomTransformers
				? prevGetCustomTransformers(program)
				: undefined),
		};
		customTransformers.before = [
			require('@nestjs/swagger/plugin').before(SwaggerPluginOptions, program),
			...(customTransformers.before || []),
		];
		return customTransformers;
	};
}
