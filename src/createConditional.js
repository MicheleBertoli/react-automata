import React from 'react'
import PropTypes from 'prop-types'
import globToRegExp from 'glob-to-regexp'
import idx from 'idx'
import Context from './context'

export const createConditional = (displayName, contextField) => {
  class Conditional extends React.PureComponent {
    static getDerivedStateFromProps(props) {
      const expectedValues = Array.isArray(props.is) ? props.is : [props.is]
      const actualValues = Array.isArray(props.value)
        ? props.value
        : [props.value]

      return {
        visible: expectedValues.some(expectedValue => {
          const matcher = globToRegExp(expectedValue)
          return actualValues.some(actualValue => matcher.test(actualValue))
        }),
      }
    }

    state = {}

    componentDidMount() {
      if (this.state.visible && this.props.onShow) {
        this.props.onShow()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!prevState.visible && this.state.visible && this.props.onShow) {
        this.props.onShow()
      }

      if (prevState.visible && !this.state.visible && this.props.onHide) {
        this.props.onHide()
      }
    }

    render() {
      if (typeof this.props.render === 'function') {
        return this.props.render(this.state.visible)
      }

      return this.state.visible ? this.props.children : null
    }
  }

  const Container = props => (
    <Context.Consumer>
      {context => (
        <Conditional
          {...props}
          value={idx(context, _ => _[props.channel || 'DEFAULT'][contextField])}
        />
      )}
    </Context.Consumer>
  )

  Container.defaultProps = {
    children: null,
  }

  Container.displayName = displayName

  Container.propTypes = {
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

  return Container
}

export default createConditional
