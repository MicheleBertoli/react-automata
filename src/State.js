import React from 'react'
import PropTypes from 'prop-types'
import minimatch from 'minimatch'

const matches = (value, machineState) =>
  machineState &&
  (Array.isArray(value)
    ? value.some(state => minimatch(machineState, state))
    : minimatch(machineState, value))

class State extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      shouldShow: matches(props.value, context.machineState),
    }

    if (this.state.shouldShow && props.onEnter) {
      props.onEnter(context.machineState)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      !this.state.shouldShow &&
      matches(this.props.value, nextContext.machineState)
    ) {
      this.setState({
        shouldShow: true,
      })

      if (this.props.onEnter) {
        this.props.onEnter(nextContext.machineState)
      }
    }

    if (
      this.state.shouldShow &&
      !matches(this.props.value, nextContext.machineState)
    ) {
      this.setState({
        shouldShow: false,
      })

      if (this.props.onLeave) {
        this.props.onLeave(nextContext.machineState)
      }
    }
  }

  render() {
    return this.state.shouldShow ? this.props.children : null
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
