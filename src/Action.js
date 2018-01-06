import React from 'react'
import PropTypes from 'prop-types'

const matches = (target, actions) =>
  Array.isArray(target)
    ? actions.some(action => target.includes(action))
    : actions.includes(target)

class Action extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      shouldShow: Boolean(this.props.initial),
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context.actions !== nextContext.actions) {
      if (
        this.state.shouldShow &&
        (this.props.hide
          ? matches(this.props.hide, nextContext.actions)
          : !matches(this.props.show, nextContext.actions))
      ) {
        this.setState({
          shouldShow: false,
        })
      }

      if (
        !this.state.shouldShow &&
        matches(this.props.show, nextContext.actions)
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

Action.contextTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
}

Action.defaultProps = {
  children: null,
}

Action.propTypes = {
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

export default Action
