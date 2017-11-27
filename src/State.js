import React from 'react'
import PropTypes from 'prop-types'
import minimatch from 'minimatch'
import { mutuallyExclusive } from './utils'

const shouldShow = (props, context) =>
  context.machineState &&
  ((props.name && minimatch(context.machineState, props.name)) ||
    (props.names &&
      props.names.some(name => minimatch(context.machineState, name))))

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
  children: null,
}

State.propTypes = {
  name: PropTypes.string,
  names: mutuallyExclusive('name', PropTypes.arrayOf(PropTypes.string)),
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

State.contextTypes = {
  machineState: PropTypes.string,
}

export default State
