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

      const value = getContextValue(context, props.channel)

      this.state = {
        visible: shouldShow(props, value),
      }

      if (this.state.visible && props.onShow) {
        props.onShow()
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const value = getContextValue(nextContext, nextProps.channel)

      if (!this.state.visible && shouldShow(nextProps, value)) {
        this.setState({
          visible: true,
        })

        if (nextProps.onShow) {
          nextProps.onShow()
        }
      }

      if (this.state.visible && shouldHide(nextProps, value)) {
        this.setState({
          visible: false,
        })

        if (nextProps.onHide) {
          nextProps.onHide()
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
    onHide: PropTypes.func,
    onShow: PropTypes.func,
  }

  Conditional.defaultProps = {
    children: null,
  }

  return Conditional
}

export default createConditional
