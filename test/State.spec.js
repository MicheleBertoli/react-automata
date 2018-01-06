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

test('regular', () => {
  const Context = createContext(
    'a',
    <State value="a">
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('regular (multiple)', () => {
  const Context = createContext(
    'a',
    <State value={['foo', 'a']}>
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested', () => {
  const Context = createContext(
    'a.b',
    <State value="*.b">
      <div />
    </State>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('nested (multiple)', () => {
  const Context = createContext(
    'a.b',
    <State value={['foo', '*.b']}>
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
    'a',
    <State value="a" onEnter={spyOnEnter} onLeave={spyOnLeave} />
  )
  const instance = TestRenderer.create(<Context />).getInstance()

  expect(spyOnEnter).toHaveBeenCalledTimes(1)
  expect(spyOnEnter).toHaveBeenCalledWith('a')

  instance.setState({ machineState: 'b' })

  expect(spyOnLeave).toHaveBeenCalledTimes(1)
  expect(spyOnLeave).toHaveBeenCalledWith('b')

  spyOnEnter.mockClear()
  instance.setState({ machineState: 'a' })

  expect(spyOnEnter).toHaveBeenCalledTimes(1)
  expect(spyOnEnter).toHaveBeenCalledWith('a')
})
