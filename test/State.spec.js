import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import { State } from '../src'

const createContext = (initialState, Tree) => {
  class Context extends React.Component {
    state = initialState

    getChildContext() {
      return { ...this.state }
    }

    render() {
      return Tree
    }
  }

  Context.childContextTypes = {
    machineState: PropTypes.string,
  }

  return Context
}

test('visible', () => {
  const Context = createContext(
    { machineState: 'a' },
    <State name="a">
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('not visible', () => {
  const Context = createContext(
    null,
    <State name="a">
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(0)
})

test('callbacks work', () => {
  const spyOnEnter = jest.fn()
  const spyOnLeave = jest.fn()

  const Context = createContext(
    null,
    <State name="a" onEnter={spyOnEnter} onLeave={spyOnLeave} />
  )

  const instance = TestRenderer.create(<Context />).getInstance()
  instance.setState({ machineState: 'a' })

  expect(spyOnEnter).toHaveBeenCalledTimes(1)

  instance.setState({ machineState: null })

  expect(spyOnLeave).toHaveBeenCalledTimes(1)
})
