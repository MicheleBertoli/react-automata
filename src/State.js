import React from 'react'
import PropTypes from 'prop-types'
import minimatch from 'minimatch'

const shouldShow = (props, context) =>
  context.machineState &&
  (Array.isArray(props.value)
    ? props.value.some(state => minimatch(context.machineState, state))
    : minimatch(context.machineState, props.value))

class State extends React.Component {
  constructor(props, context) {
    super(props, context)

    if (props.onEnter && shouldShow(props, context)) {
      props.onEnter(context.machineState)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      this.props.onEnter &&
      !shouldShow(this.props, this.context) &&
      shouldShow(this.props, nextContext)
    ) {
      this.props.onEnter(nextContext.machineState)
    }

    if (
      this.props.onLeave &&
      shouldShow(this.props, this.context) &&
      !shouldShow(this.props, nextContext)
    ) {
      this.props.onLeave(nextContext.machineState)
    }
  }

  render() {
    return shouldShow(this.props, this.context) ? this.props.children : null
  }
}

State.defaultProps = {
  children: null,
}

State.propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

State.contextTypes = {
  machineState: PropTypes.string,
}

export default State
