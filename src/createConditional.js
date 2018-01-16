import React from 'react'
import PropTypes from 'prop-types'

export const createConditional = ({
  displayName,
  contextTypes,
  propTypes,
  shouldShow,
  shouldHide,
}) => {
  class Conditional extends React.Component {
    constructor(props, context) {
      super(props, context)

      this.state = {
        visible: shouldShow(props, context),
      }

      if (this.state.visible && props.onEnter) {
        props.onEnter()
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (!this.state.visible && shouldShow(nextProps, nextContext)) {
        this.setState({
          visible: true,
        })

        if (nextProps.onEnter) {
          nextProps.onEnter()
        }
      }

      if (this.state.visible && shouldHide(nextProps, nextContext)) {
        this.setState({
          visible: false,
        })

        if (nextProps.onLeave) {
          nextProps.onLeave()
        }
      }
    }

    render() {
      return this.state.visible ? this.props.children : null
    }
  }

  Conditional.displayName = displayName

  Conditional.contextTypes = contextTypes

  Conditional.propTypes = {
    ...propTypes,
    children: PropTypes.node,
  }

  Conditional.defaultProps = {
    children: null,
  }

  return Conditional
}

export default createConditional
