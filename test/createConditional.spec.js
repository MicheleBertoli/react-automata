import React from 'react'
import TestRenderer from 'react-test-renderer'
import Context from '../src/context'
import createConditional from '../src/createConditional'

const displayName = 'displayName'
const contextField = 'contextField'
const context = {
  DEFAULT: {
    contextField: 'foo',
  },
}

const create = children =>
  TestRenderer.create(
    <Context.Provider value={context}>{children}</Context.Provider>
  )

test('statics', () => {
  const Conditional = createConditional(displayName)

  expect(Conditional.displayName).toBe(displayName)
})

describe('visible', () => {
  test('string', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = create(
      <Conditional is="foo">
        <div />
      </Conditional>
    )

    expect(renderer.root.findAllByType('div')).toHaveLength(1)
  })

  test('array', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = create(
      <Conditional is={['foo']}>
        <div />
      </Conditional>
    )

    expect(renderer.root.findAllByType('div')).toHaveLength(1)
  })

  test('glob', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = create(
      <Conditional is="*o*">
        <div />
      </Conditional>
    )

    expect(renderer.root.findAllByType('div')).toHaveLength(1)
  })
})

test('render prop', () => {
  const Conditional = createConditional(displayName, contextField)
  const render = jest.fn(() => <div />)
  create(<Conditional is="foo" render={render} />)

  expect(render).toHaveBeenCalledWith(true)
})

test('not visible', () => {
  const Conditional = createConditional(displayName, contextField)
  const renderer = create(
    <Conditional is="bar">
      <div />
    </Conditional>
  )

  expect(renderer.root.findAllByType('div')).toHaveLength(0)
})

test('callbacks', () => {
  const Conditional = createConditional(displayName, contextField)
  const onShow = jest.fn()
  const onHide = jest.fn()

  class Wrapper extends React.Component {
    state = { is: 'foo' }

    render() {
      return <Conditional is={this.state.is} onShow={onShow} onHide={onHide} />
    }
  }

  const renderer = create(<Wrapper />)

  expect(onShow).toHaveBeenCalled()

  renderer.root.findByType(Wrapper).instance.setState({ is: 'bar' })

  expect(onHide).toHaveBeenCalled()
})
