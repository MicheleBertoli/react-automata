export const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

export const isStateless = Component =>
  !(Component.prototype && Component.prototype.isReactComponent)

export const stringify = (state, path = []) => {
  if (typeof state === 'string') {
    return path.concat(state).join('.')
  }
  return Object.keys(state).reduce(
    (prev, key) => prev.concat(stringify(state[key], path.concat(key))),
    []
  )
}
