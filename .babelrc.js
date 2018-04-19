const { BABEL_ENV, NODE_ENV } = process.env
const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test'

module.exports = {
  presets: [['env', { modules: false }], 'react'],

  plugins: [
    cjs && 'transform-es2015-modules-commonjs',
    'transform-class-properties',
    'transform-object-rest-spread',
    'babel-plugin-idx',
  ].filter(Boolean),
}
