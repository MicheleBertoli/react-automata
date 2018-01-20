import React from 'react'
import TestRenderer from 'react-test-renderer'
import createConditional from '../src/createConditional'

const defaultOptions = {
  displayName: 'Conditional',
  contextTypes: {},
  propTypes: {},
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
  expect(Conditional.contextTypes).toBe(defaultOptions.contextTypes)
  expect(Conditional.propTypes).toEqual(
    expect.objectContaining({
      children: expect.any(Function),
    })
  )
})

test('visible', () => {
  const options = {
    ...defaultOptions,
    initial: jest.fn(() => true),
    shouldShow: jest.fn(() => true),
    shouldHide: jest.fn(() => true),
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const onEnter = jest.fn()
  const onLeave = jest.fn()
  const renderer = TestRenderer.create(
    <Container onEnter={onEnter} onLeave={onLeave} />
  )
  const { root } = renderer
  const instance = renderer.getInstance()

  expect(options.initial).toHaveBeenCalled()
  expect(root.findAllByType('div')).toHaveLength(1)
  expect(onEnter).toHaveBeenCalled()

  instance.forceUpdate()

  expect(options.shouldHide).toHaveBeenCalled()
  expect(root.findAllByType('div')).toHaveLength(0)
  expect(onLeave).toHaveBeenCalled()

  instance.forceUpdate()

  expect(options.shouldShow).toHaveBeenCalled()
  expect(root.findAllByType('div')).toHaveLength(1)
  expect(onEnter).toHaveBeenCalledTimes(2)
})

test('not visible', () => {
  const options = {
    defaultOptions,
    initial: jest.fn(() => false),
    shouldShow: jest.fn(() => false),
    shouldHide: jest.fn(() => false),
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const onEnter = jest.fn()
  const renderer = TestRenderer.create(<Container onEnter={onEnter} />)
  const { root } = renderer

  expect(options.initial).toHaveBeenCalled()
  expect(root.findAllByType('div')).toHaveLength(0)
  expect(onEnter).not.toHaveBeenCalled()
})

test('render prop', () => {
  const options = {
    ...defaultOptions,
    initial: jest.fn(() => true),
    shouldShow: jest.fn(() => true),
    shouldHide: jest.fn(() => true),
  }
  const Conditional = createConditional(options)
  const Container = wrap(Conditional)
  const renderProp = jest.fn(() => null)
  const renderer = TestRenderer.create(<Container render={renderProp} />)
  const instance = renderer.getInstance()

  expect(renderProp).toHaveBeenCalledWith(true)

  instance.forceUpdate()

  expect(renderProp).toHaveBeenCalledWith(false)

  instance.forceUpdate()

  expect(renderProp).toHaveBeenCalledWith(true)
})
