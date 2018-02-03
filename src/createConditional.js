import React from 'react'
import PropTypes from 'prop-types'
import { getContextValue } from './utils'

export const createConditional = ({
  displayName,
  propTypes,
  shouldShow,
  shouldHide,
}) => {
  class Conditional extends React.Component {
    constructor(props, context) {
      super(props, context)

      this.state = {
        visible: shouldShow(props, getContextValue(context, props.channel)),
      }

      if (this.state.visible && props.onEnter) {
        props.onEnter()
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (
        !this.state.visible &&
        shouldShow(nextProps, getContextValue(nextContext, nextProps.channel))
      ) {
        this.setState({
          visible: true,
        })

        if (nextProps.onEnter) {
          nextProps.onEnter()
        }
      }

      if (
        this.state.visible &&
        shouldHide(nextProps, getContextValue(nextContext, nextProps.channel))
      ) {
        this.setState({
          visible: false,
        })

        if (nextProps.onLeave) {
          nextProps.onLeave()
        }
      }
    }

    render() {
      if (typeof this.props.render === 'function') {
        return this.props.render(this.state.visible)
      }
      return this.state.visible ? this.props.children : null
    }
  }

  Conditional.displayName = displayName

  Conditional.contextTypes = {
    automata: PropTypes.object,
  }

  Conditional.propTypes = {
    ...propTypes,
    channel: PropTypes.string,
    children: PropTypes.node,
    render: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
  }

  Conditional.defaultProps = {
    children: null,
  }

  return Conditional
}

export default createConditional
