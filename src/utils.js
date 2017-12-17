export const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

export const isStateless = Component =>
  !(Component.prototype && Component.prototype.isReactComponent)
