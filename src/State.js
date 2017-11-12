import React from 'react'
import PropTypes from 'prop-types'

class State extends React.Component {
  componentWillReceiveProps(nextProps, nextContext) {
    if (
      this.props.onEnter &&
      !(this.context.machineState === this.props.name) &&
      nextContext.machineState === this.props.name
    ) {
      this.props.onEnter()
    }

    if (
      this.props.onLeave &&
      this.context.machineState === this.props.name &&
      !(nextContext.machineState === this.props.name)
    ) {
      this.props.onLeave()
    }
  }

  render() {
    return this.context.machineState === this.props.name
      ? this.props.children
      : null
  }
}

State.defaultProps = {
  children: null,
  onEnter: null,
  onLeave: null,
}

State.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

State.contextTypes = {
  machineState: PropTypes.string,
}

export default State
