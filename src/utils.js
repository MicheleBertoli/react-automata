import globToRegExp from 'glob-to-regexp'
import idx from 'idx'

export const DEFAULT_CHANNEL = 'DEFAULT'

export const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

export const isStateless = Component =>
  !idx(Component, _ => _.prototype.isReactComponent)

export const stringify = (state, path = []) => {
  if (typeof state === 'string') {
    return path.concat(state).join('.')
  }

  return Object.keys(state).reduce(
    (prev, key) => prev.concat(stringify(state[key], path.concat(key))),
    []
  )
}

export const getPatterns = glob =>
  Array.isArray(glob)
    ? glob.map(pattern => globToRegExp(pattern))
    : [globToRegExp(glob)]

export const matches = (patterns, value) => {
  const values = Array.isArray(value) ? value : [value]

  return patterns.some(pattern => values.some(val => pattern.test(val)))
}
