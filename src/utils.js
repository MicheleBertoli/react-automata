import PropTypes from 'prop-types'

export const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

export const isStateless = Component =>
  !(Component.prototype && Component.prototype.isReactComponent)

export const mutuallyExclusive = (prop, type) => (
  props,
  propName,
  componentName
) => {
  if (props[prop] && props[propName]) {
    return new Error(
      `Since both \`${prop}\` and \`${propName}\` have been supplied, \`${
        propName
      }\` will be ignored.`
    )
  }
  if (!props[prop] && !props[propName]) {
    return new Error(
      `At least one of \`${prop}\` and \`${propName}\` is required.`
    )
  }
  return PropTypes.checkPropTypes(
    { [propName]: type },
    { [propName]: props[propName] },
    propName,
    componentName
  )
}
