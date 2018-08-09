import idx from 'idx'
import memoize from 'memoize-one'
import PropTypes from 'prop-types'
import React from 'react'
import Context from './context'
import { DEFAULT_CHANNEL, getPatterns, matches } from './utils'

const createConditional = (displayName, contextField) => {
  class Conditional extends React.Component {
    componentDidMount() {
      if (this.isVisible && this.props.onShow) {
        this.props.onShow()
      }
    }

    componentDidUpdate() {
      if (!this.wasVisible && this.isVisible && this.props.onShow) {
        this.props.onShow()
      }

      if (this.wasVisible && !this.isVisible && this.props.onHide) {
        this.props.onHide()
      }
    }

    getPatterns = memoize(getPatterns)

    matches = memoize(matches)

    render() {
      this.wasVisible = this.isVisible
      const patterns = this.getPatterns(this.props.is)
      this.isVisible = this.matches(patterns, this.props.value)

      if (this.props.render) {
        return this.props.render(this.isVisible)
      }

      return this.isVisible ? this.props.children : null
    }
  }

  const Container = props => (
    <Context.Consumer>
      {context => (
        <Conditional
          {...props}
          value={idx(
            context,
            _ => _[props.channel || DEFAULT_CHANNEL][contextField]
          )}
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
