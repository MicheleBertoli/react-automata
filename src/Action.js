import PropTypes from 'prop-types'
import createConditional from './createConditional'

const displayName = 'Action'

const contextTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
}

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  hide: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  show: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

const matches = (value, actions) =>
  Array.isArray(value)
    ? actions.some(action => value.includes(action))
    : actions.includes(value)

export const shouldShow = (props, context) =>
  matches(props.show, context.actions)

export const shouldHide = (props, context) =>
  props.hide
    ? matches(props.hide, context.actions)
    : !matches(props.show, context.actions)

export default createConditional({
  displayName,
  contextTypes,
  propTypes,
  shouldShow,
  shouldHide,
})
