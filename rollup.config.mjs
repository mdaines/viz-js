import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/standalone.mjs',
  output: {
    name: 'Viz',
    file: 'lib/viz.js',
    format: 'umd',
    plugins: [
      terser()
    ]
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      ignore: ["./lib/encoded.mjs"]
    })
  ]
};
