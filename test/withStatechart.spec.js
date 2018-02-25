import React from 'react'
import { Machine, State } from 'xstate'
import TestRenderer from 'react-test-renderer'
import { withStatechart } from '../src'

const statechart = {
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

test('statechart', () => {
  const Component = () => <div />
  const StateMachine1 = withStatechart(statechart)(Component)
  const StateMachine2 = withStatechart(Machine(statechart))(Component)
  const renderer1 = TestRenderer.create(<StateMachine1 />).getInstance()
  const renderer2 = TestRenderer.create(<StateMachine2 />).getInstance()

  expect(renderer1.state.machineState).toEqual(renderer2.state.machineState)
})

test('props', () => {
  const Component = () => <div />
  const StateMachine = withStatechart(statechart)(Component)
  const machineState = new State('b')
  const renderer = TestRenderer.create(
    <StateMachine
      initialData={{ foo: 'bar' }}
      initialMachineState={machineState}
    />
  )
  const instance = renderer.getInstance()
  const component = renderer.root.findByType(Component)

  expect(component.props.foo).toBe('bar')
  expect(instance.state.machineState.value).toBe('b')
})

test('state', () => {
  const Component = () => <div />
  Component.defaultProps = { counter: 0 }
  const StateMachine = withStatechart(statechart)(Component)
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

  const StateMachine = withStatechart(statechart)(Component)
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

  const StateMachine = withStatechart(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith('EVENT')
  expect(spy).toHaveBeenLastCalledWith(
    expect.objectContaining({ value: 'a' }),
    'EVENT'
  )
})
