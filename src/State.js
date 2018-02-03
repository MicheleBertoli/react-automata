import PropTypes from 'prop-types'
import minimatch from 'minimatch'
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

  return values.some(val => states.some(state => minimatch(state, val)))
}

export const shouldShow = (props, context) =>
  matches(props.value, context.machineState)

export const shouldHide = (props, context) =>
  !matches(props.value, context.machineState)

export default createConditional({
  displayName,
  propTypes,
  shouldShow,
  shouldHide,
})
