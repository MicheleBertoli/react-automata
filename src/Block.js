import React from 'react'
import PropTypes from 'prop-types'

const matches = (actions, target) =>
  Array.isArray(target)
    ? actions.some(action => target.includes(action))
    : actions.includes(target)

class Block extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      shouldShow: Boolean(props.initial),
    }
  }

  componentDidUpdate() {
    if (this.context.actions) {
      if (
        this.state.shouldShow &&
        matches(this.context.actions, this.props.hide)
      ) {
        this.setState({
          shouldShow: false,
        })
      }

      if (
        !this.state.shouldShow &&
        matches(this.context.actions, this.props.show)
      ) {
        this.setState({
          shouldShow: true,
        })
      }
    }
  }

  render() {
    return this.state.shouldShow ? this.props.children : null
  }
}

Block.contextTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
}

Block.defaultProps = {
  children: null,
}

Block.propTypes = {
  children: PropTypes.node,
  hide: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  initial: PropTypes.bool,
  show: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
}

export default Block
