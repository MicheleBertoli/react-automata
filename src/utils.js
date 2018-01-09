/* @flow */
export const getComponentName = (Component: {
  displayName: string,
  name: string,
}): string => Component.displayName || Component.name || 'Component'

export const isStateless = (Component: {
  prototype: { isReactComponent: boolean },
}) => !(Component.prototype && Component.prototype.isReactComponent)
