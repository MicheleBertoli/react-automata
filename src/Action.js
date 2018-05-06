import PropTypes from 'prop-types'
import createConditional from './createConditional'

const displayName = 'Action'

const propTypes = {
  hide: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  show: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
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
  propTypes: process.env.NODE_ENV !== 'production' ? propTypes : null,
  shouldShow,
  shouldHide,
})
