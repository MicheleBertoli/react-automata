import PropTypes from 'prop-types'
import minimatch from 'minimatch'
import createConditional from './createConditional'

const displayName = 'State'

const contextTypes = {
  machineState: PropTypes.string,
}

const propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

const matches = (value, machineState) =>
  machineState &&
  (Array.isArray(value)
    ? value.some(state => minimatch(machineState, state))
    : minimatch(machineState, value))

const initial = (props, context) => matches(props.value, context.machineState)

const shouldShow = (props, context) =>
  matches(props.value, context.machineState)

const shouldHide = (props, context) =>
  !matches(props.value, context.machineState)

export default createConditional({
  displayName,
  contextTypes,
  propTypes,
  initial,
  shouldShow,
  shouldHide,
})
