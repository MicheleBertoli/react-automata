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

const initialState = 'a'
const nextState = 'b'
const nestedState = 'a.b'
const pattern = '*.b'

test('visible (single)', () => {
  const Context = createContext(
    { machineState: initialState },
    <State value={initialState}>
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('visible (multiple)', () => {
  const Context = createContext(
    { machineState: initialState },
    <State value={['foo', initialState]}>
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested (single)', () => {
  const Context = createContext(
    { machineState: nestedState },
    <State value={pattern}>
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested (multiple)', () => {
  const Context = createContext(
    { machineState: nestedState },
    <State value={['foo', pattern]}>
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('not visible', () => {
  const Context = createContext(
    null,
    <State value={initialState}>
      <div />
    </State>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(0)
})

test('callbacks', () => {
  const spyOnEnter = jest.fn()
  const spyOnLeave = jest.fn()

  const Context = createContext(
    { machineState: initialState },
    <State value={initialState} onEnter={spyOnEnter} onLeave={spyOnLeave} />
  )

  const instance = TestRenderer.create(<Context />).getInstance()

  expect(spyOnEnter).toHaveBeenCalledTimes(1)
  expect(spyOnEnter).toHaveBeenCalledWith(initialState)

  instance.setState({ machineState: nextState })

  expect(spyOnLeave).toHaveBeenCalledTimes(1)
  expect(spyOnLeave).toHaveBeenCalledWith(nextState)

  spyOnEnter.mockClear()
  instance.setState({ machineState: initialState })

  expect(spyOnEnter).toHaveBeenCalledTimes(1)
  expect(spyOnEnter).toHaveBeenCalledWith(initialState)
})
