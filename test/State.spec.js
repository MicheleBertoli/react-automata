import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import { Section } from '../src'

const createContext = (actions, Tree) => {
  class Context extends React.Component {
    state = { actions }

    getChildContext() {
      return { ...this.state }
    }

    render() {
      return Tree
    }
  }

  Context.childContextTypes = {
    actions: PropTypes.arrayOf(PropTypes.string),
  }

  return Context
}

const action = 'action'

test('initial', () => {
  const Context = createContext(
    null,
    <Section initial>
      <div />
    </Section>
  )

  const { root } = TestRenderer.create(<Context />)

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('show', () => {
  const Context = createContext(
    [action],
    <Section show={action}>
      <div />
    </Section>
  )

  const renderer = TestRenderer.create(<Context />)
  renderer.getInstance().forceUpdate()

  expect(renderer.root.findAllByType('div')).toHaveLength(1)
})

test('show (multiple)', () => {
  const Context = createContext(
    [action],
    <Section show={[action, 'foo']}>
      <div />
    </Section>
  )

  const renderer = TestRenderer.create(<Context />)
  renderer.getInstance().forceUpdate()

  expect(renderer.root.findAllByType('div')).toHaveLength(1)
})

test('hide', () => {
  const Context = createContext(
    [action],
    <Section initial hide={action}>
      <div />
    </Section>
  )

  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  renderer.getInstance().forceUpdate()

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('hide (multiple)', () => {
  const Context = createContext(
    [action],
    <Section initial hide={[action, 'foo']}>
      <div />
    </Section>
  )

  const renderer = TestRenderer.create(<Context />)

  expect(renderer.root.findAllByType('div')).toHaveLength(1)

  renderer.getInstance().forceUpdate()

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})
