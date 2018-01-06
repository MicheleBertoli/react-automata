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

const setState = (renderer, actions) =>
  renderer.getInstance().setState({ actions })

test('show', () => {
  const Context = createContext(
    <Action show="action">
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)

  setState(renderer, ['action'])

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer, ['foo'])

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('show (multiple)', () => {
  const Context = createContext(
    <Action show={['action', 'foo']}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(0)

  setState(renderer, ['action'])

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer, ['bar'])

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('hide', () => {
  const Context = createContext(
    <Action initial hide="action">
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer, ['action'])

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('hide (multiple)', () => {
  const Context = createContext(
    <Action initial hide={['action', 'foo']}>
      <div />
    </Action>
  )
  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  setState(renderer, ['action'])

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})
