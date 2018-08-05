import React from 'react'
import { Machine, State } from 'xstate'
import TestRenderer from 'react-test-renderer'
import { withStatechart } from '../src'

const actionFunction = jest.fn()

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
      onEntry: ['actionMethod', actionFunction],
      activities: ['activityMethod'],
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

test('render', () => {
  const spy = jest.fn()
  const Component = () => {
    spy()
    return <div />
  }
  const StateMachine = withStatechart(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  spy.mockClear()
  instance.handleTransition('FOO')

  expect(spy).not.toHaveBeenCalled()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalled()
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

test('actions', () => {
  const actionMethod = jest.fn()
  const activityMethod = jest.fn()

  class Component extends React.Component {
    actionMethod(...args) {
      actionMethod(...args)
    }

    activityMethod(...args) {
      activityMethod(...args)
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStatechart(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(actionMethod).toHaveBeenCalledTimes(1)
  expect(actionMethod).toHaveBeenCalledWith({}, 'EVENT')
  expect(actionFunction).toHaveBeenCalledTimes(1)
  expect(actionFunction).toHaveBeenCalledWith({}, 'EVENT')
  expect(activityMethod).toHaveBeenCalledTimes(1)
  expect(activityMethod).toHaveBeenCalledWith(true)
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
