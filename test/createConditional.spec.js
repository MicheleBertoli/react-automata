import React from 'react'
import TestRenderer from 'react-test-renderer'
import createConditional from '../src/createConditional'

jest.mock('../src/utils', () => ({
  getContextValue: () => ({ contextField: 'foo' }),
}))

const displayName = 'displayName'
const contextField = 'contextField'

test('statics', () => {
  const Conditional = createConditional(displayName)

  expect(Conditional.displayName).toBe(displayName)
})

describe('visible', () => {
  test('string', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = TestRenderer.create(
      <Conditional is="foo">
        <div />
      </Conditional>
    )

    expect(renderer.root.findAllByType('div')).toHaveLength(1)
  })

  test('array', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = TestRenderer.create(
      <Conditional is={['foo']}>
        <div />
      </Conditional>
    )

    expect(renderer.root.findAllByType('div')).toHaveLength(1)
  })

  test('glob', () => {
    const Conditional = createConditional(displayName, contextField)
    const renderer = TestRenderer.create(
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
  TestRenderer.create(<Conditional is="foo" render={render} />)

  expect(render).toHaveBeenCalledWith(true)
})

test('not visible', () => {
  const Conditional = createConditional(displayName, contextField)
  const renderer = TestRenderer.create(
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
  const renderer = TestRenderer.create(<Wrapper />)

  expect(onShow).toHaveBeenCalled()

  renderer.getInstance().setState({ is: 'bar' })

  expect(onHide).toHaveBeenCalled()
})
