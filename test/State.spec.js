import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import { State } from '../src'

const createContext = (machineState, Component) => {
  class Context extends React.Component {
    state = { machineState }

    getChildContext() {
      return { ...this.state }
    }

    render() {
      return Component
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

test('regular (single)', () => {
  const Context = createContext(
    initialState,
    <State value={initialState}>
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('regular (multiple)', () => {
  const Context = createContext(
    initialState,
    <State value={['foo', initialState]}>
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested (single)', () => {
  const Context = createContext(
    nestedState,
    <State value={pattern}>
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested (multiple)', () => {
  const Context = createContext(
    nestedState,
    <State value={['foo', pattern]}>
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('no match', () => {
  const Context = createContext(
    null,
    <State>
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
    initialState,
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
