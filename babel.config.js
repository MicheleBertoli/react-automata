const { BABEL_ENV, NODE_ENV } = process.env
const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test'

module.exports = {
  presets: [['@babel/env', { modules: false, loose: true }], '@babel/react'],

  plugins: [
    cjs && '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-idx',
    'annotate-pure-calls',
    NODE_ENV !== 'test' && [
      'transform-react-remove-prop-types',
      { mode: 'unsafe-wrap' },
    ],
  ].filter(Boolean),
}
