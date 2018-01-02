import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import { Action } from '../src'

const createContext = Component => {
  class Context extends React.Component {
    getChildContext() {
      return { ...this.state }
    }

    render() {
      return Component
    }
  }

  Context.childContextTypes = {
    actions: PropTypes.arrayOf(PropTypes.string),
  }

  return Context
}

const action = 'action'

const setState = renderer =>
  renderer.getInstance().setState({ actions: [action] })

test('initial', () => {
  const Context = createContext(
    <Action>
      <div />
    </Action>
  )
  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('show', () => {
  const Context = createContext(
    <Action show={action}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)

  setState(renderer)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)
})

test('show (multiple)', () => {
  const Context = createContext(
    <Action show={[action, 'foo']}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)

  setState(renderer)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)
})

test('hide', () => {
  const Context = createContext(
    <Action hide={action}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('hide (multiple)', () => {
  const Context = createContext(
    <Action hide={[action, 'foo']}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})
