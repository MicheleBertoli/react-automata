import PropTypes from 'prop-types'
import minimatch from 'minimatch'
import createConditional from './createConditional'

const displayName = 'State'

const contextTypes = {
  machineState: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
}

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
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
  contextTypes,
  propTypes,
  shouldShow,
  shouldHide,
})
