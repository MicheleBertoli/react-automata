import React from 'react'
import PropTypes from 'prop-types'

const shouldShow = (props, context) =>
  context.machineState &&
  ((props.name && props.name === context.machineState) ||
    (props.names && props.names.includes(context.machineState)))

class State extends React.Component {
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
  name: null,
  names: null,
  children: null,
  onEnter: null,
  onLeave: null,
}

State.propTypes = {
  name: PropTypes.string,
  names: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

State.contextTypes = {
  machineState: PropTypes.string,
}

export default State
