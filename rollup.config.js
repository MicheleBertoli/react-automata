/* eslint-disable global-require */

import babel from 'rollup-plugin-babel'

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return id => pattern.test(id)
}

const generateConfig = pkg => ({
  input: `packages/${pkg.name}/src/index.js`,

  output: [
    { file: `packages/${pkg.name}/${pkg.main}`, format: 'cjs' },
    { file: `packages/${pkg.name}/${pkg.module}`, format: 'es' },
  ],

  external: makeExternalPredicate([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),

  plugins: [babel()],
})

export default [
  generateConfig(require('./packages/react-automata-utilities/package.json')),
  generateConfig(
    require('./packages/react-automata-test-utilities/package.json')
  ),
  generateConfig(require('./packages/react-automata/package.json')),
]
