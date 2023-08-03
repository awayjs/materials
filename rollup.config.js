import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
	input: './dist/index.js',
	output: {
		name: 'AwayjsMaterials',
		globals: {
			'@awayjs/core': 'AwayjsCore',
			'@awayjs/stage': 'AwayjsStage',
			'@awayjs/view': 'AwayjsView',
			'@awayjs/renderer': 'AwayjsRenderer'
		},
		sourcemap: true,
		format: 'umd',
		file: './bundle/awayjs-materials.umd.js'
	},
	external: [
		'@awayjs/core',
		'@awayjs/stage',
		'@awayjs/view',
		'@awayjs/renderer'
	],
	plugins: [
		nodeResolve(),
		commonjs(),
		terser(),
	]
};