import React from 'react'
import PropTypes from 'prop-types'
import globToRegExp from 'glob-to-regexp'
import { getContextValue } from './utils'

export const createConditional = (displayName, contextField) => {
  class Conditional extends React.Component {
    matches = (is, contextValue) => {
      const expectedValues = Array.isArray(is) ? is : [is]
      const actualValues = Array.isArray(contextValue[contextField])
        ? contextValue[contextField]
        : [contextValue[contextField]]

      return expectedValues.some(expectedValue => {
        const matcher = globToRegExp(expectedValue)
        return actualValues.some(actualValue => matcher.test(actualValue))
      })
    }

    state = {
      visible: this.matches(
        this.props.is,
        getContextValue(this.context, this.props.channel)
      ),
    }

    componentDidMount() {
      if (this.state.visible && this.props.onShow) {
        this.props.onShow()
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const contextValue = getContextValue(nextContext, nextProps.channel)

      if (!this.state.visible && this.matches(nextProps.is, contextValue)) {
        this.setState({
          visible: true,
        })

        if (nextProps.onShow) {
          nextProps.onShow()
        }
      }

      if (this.state.visible && !this.matches(nextProps.is, contextValue)) {
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

  Conditional.defaultProps = {
    children: null,
  }

  Conditional.displayName = displayName

  Conditional.contextTypes = {
    automata: PropTypes.object,
  }

  Conditional.propTypes = {
    channel: PropTypes.string,
    children: PropTypes.node,
    is: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    render: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
  }

  return Conditional
}

export default createConditional
