import idx from 'idx'

export const getContextValue = (props, context) =>
  idx(context, _ => _.automata.state[props.channel || context.automata.channel])

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
