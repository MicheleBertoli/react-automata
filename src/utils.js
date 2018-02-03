export const CHANNEL = 'CHANNEL'

export const getContextValue = (props, context) => {
  if (!context.automata) {
    return null
  }

  const keys = Object.keys(context.automata)

  if (!props.channel && keys.length === 1) {
    return context.automata[keys[0]]
  }

  return context.automata[props.channel || CHANNEL]
}

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
