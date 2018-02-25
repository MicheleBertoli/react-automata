import React from 'react'
import { State } from 'xstate'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { withStatechart } from '../src'

const machine = {
  initial: 'a',
  states: {
    a: {
      on: {
        EVENT: 'b',
      },
    },
    b: {
      on: {
        EVENT: 'a',
      },
      onEntry: 'onEnterB',
    },
  },
}

test('props', () => {
  const Component = () => <div />
  const StateMachine = withStatechart(machine)(Component)
  const machineState = new State('b', undefined, ['onEnterB'])
  const renderer = TestRenderer.create(
    <StateMachine
      initialData={{ counter: 0 }}
      initialMachineState={machineState}
    />
  )
  const instance = renderer.getInstance()
  const component = renderer.root.findByType(Component)

  expect(component.props.counter).toBe(0)
  expect(instance.state.machineState.value).toBe('b')
})

test('state', () => {
  const Component = () => <div />
  Component.defaultProps = { counter: 0 }
  const StateMachine = withStatechart(machine)(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const instance = renderer.getInstance()
  const component = renderer.root.findByType(Component)

  expect(component.props.counter).toBe(0)

  instance.handleTransition('EVENT', { counter: 1 })

  expect(component.props.counter).toBe(1)

  instance.handleTransition('EVENT', prevState => ({
    counter: prevState.counter + 1,
  }))

  expect(component.props.counter).toBe(2)
})

test('action methods', () => {
  const spy = jest.fn()

  class Component extends React.Component {
    onEnterB() {
      spy()
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStatechart(machine)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalledTimes(1)
})

test('lifecycle hooks', () => {
  const spy = jest.fn()

  class Component extends React.Component {
    componentWillTransition(...args) {
      spy(...args)
    }

    componentDidTransition(...args) {
      spy(...args)
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStatechart(machine)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith('EVENT')
  expect(spy).toHaveBeenLastCalledWith(
    expect.objectContaining({ value: 'a' }),
    'EVENT'
  )
})

test('Should accept an xstate StateNode object instead of a plain object statechart', () => {
  const spy = jest.fn()
  const stateNode = Machine(machine)
  class Component extends React.Component {
    onEnterB() {
      spy()
    }

    render() {
      return <div />
    }
  }
  const StateMachine = withStatechart(stateNode)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalledTimes(1)
})
