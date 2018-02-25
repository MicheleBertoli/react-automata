import idx from 'idx'
import invariant from 'invariant'

export const getContextValue = (context, name) => {
  invariant(context.automata, 'No context received.')

  const channel = name || 'DEFAULT'
  const value = context.automata[channel]

  invariant(value, 'No value for channel: "%s".', channel)

  return value
}

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
