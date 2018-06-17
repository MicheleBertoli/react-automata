import PropTypes from 'prop-types'
import globToRegExp from 'glob-to-regexp'
import createConditional from './createConditional'

const displayName = 'State'

const propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
}

const matches = (value, machineState) => {
  const values = Array.isArray(value) ? value : [value]
  const states = Array.isArray(machineState) ? machineState : [machineState]

  return values.some(val => {
    const matcher = globToRegExp(val)
    return states.some(state => matcher.test(state))
  })
}

export const shouldShow = (props, context) =>
  matches(props.value, context.machineState)

export const shouldHide = (props, context) =>
  !matches(props.value, context.machineState)

export default createConditional({
  displayName,
  propTypes: process.env.NODE_ENV !== 'production' ? propTypes : null,
  shouldShow,
  shouldHide,
})
