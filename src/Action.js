import React from 'react'
import PropTypes from 'prop-types'

const matches = (value, actions) =>
  actions &&
  (Array.isArray(value)
    ? actions.some(action => value.includes(action))
    : actions.includes(value))

class Action extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      shouldShow: Boolean(this.props.initial),
    }

    if (this.state.shouldShow && props.onEnter) {
      props.onEnter(context.actions)
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      !this.state.shouldShow &&
      matches(this.props.show, nextContext.actions)
    ) {
      this.setState({
        shouldShow: true,
      })

      if (this.props.onEnter) {
        this.props.onEnter(nextContext.actions)
      }
    }

    if (
      this.state.shouldShow &&
      (this.props.hide
        ? matches(this.props.hide, nextContext.actions)
        : !matches(this.props.show, nextContext.actions))
    ) {
      this.setState({
        shouldShow: false,
      })

      if (this.props.onLeave) {
        this.props.onLeave(nextContext.actions)
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
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
}

export default Action
