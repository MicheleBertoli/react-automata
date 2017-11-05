import React from 'react'
import PropTypes from 'prop-types'

class State extends React.Component {
  render() {
    return this.context.machineState === this.props.name
      ? this.props.children
      : null
  }
}

State.defaultProps = {
  children: null,
}

State.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
}

State.contextTypes = {
  machineState: PropTypes.string,
}

export default State
