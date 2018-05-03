import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    name: 'Viz',
    file: 'build-main/viz.es.js',
    format: 'es'
  },
  plugins: [
    babel()
  ]
};
