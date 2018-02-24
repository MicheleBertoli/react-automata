import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import createConditional from '../src/createConditional'

jest.mock('../src/utils', () => ({ getContextValue: () => {} }))

const defaultOptions = {
  displayName: 'Conditional',
  propTypes: {
    prop: PropTypes.string,
  },
}

const wrap = Conditional =>
  class Container extends React.Component {
    render() {
      return (
        <Conditional {...this.props}>
          <div />
        </Conditional>
      )
    }
  }

test('statics', () => {
  const Conditional = createConditional(defaultOptions)

  expect(Conditional.displayName).toBe(defaultOptions.displayName)
  expect(Conditional.propTypes).toEqual(
    expect.objectContaining({
      prop: expect.any(Function),
    })
  )
})

test('visible', () => {
  const options = {
    ...defaultOptions,
    shouldShow: () => true,
    shouldHide: () => true,
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const renderer = TestRenderer.create(<Container />)
  const { root } = renderer
  const instance = renderer.getInstance()

  expect(root.findAllByType('div')).toHaveLength(1)

  instance.forceUpdate()

  expect(root.findAllByType('div')).toHaveLength(0)

  instance.forceUpdate()

  expect(root.findAllByType('div')).toHaveLength(1)
})

test('render prop', () => {
  const options = {
    ...defaultOptions,
    shouldShow: () => true,
    shouldHide: () => true,
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const render = jest.fn(() => <div />)
  const renderer = TestRenderer.create(<Container render={render} />)
  const instance = renderer.getInstance()

  expect(render).toHaveBeenCalledWith(true)

  instance.forceUpdate()

  expect(render).toHaveBeenCalledWith(false)
})

test('not visible', () => {
  const options = {
    ...defaultOptions,
    shouldShow: () => false,
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const renderer = TestRenderer.create(<Container />)
  const { root } = renderer

  expect(root.findAllByType('div')).toHaveLength(0)
})

test('callbacks', () => {
  const options = {
    ...defaultOptions,
    shouldShow: jest.fn(() => true),
    shouldHide: jest.fn(() => true),
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const onShow = jest.fn()
  const onHide = jest.fn()
  const renderer = TestRenderer.create(
    <Container onShow={onShow} onHide={onHide} />
  )
  const instance = renderer.getInstance()

  expect(options.shouldShow).toHaveBeenCalled()
  expect(onShow).toHaveBeenCalled()

  instance.forceUpdate()

  expect(options.shouldHide).toHaveBeenCalled()
  expect(onHide).toHaveBeenCalled()
})
