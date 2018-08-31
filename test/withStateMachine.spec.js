import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine, State } from 'xstate'
import { withStateMachine } from '../src'

const actionFunction = jest.fn()
const sameStateFn = jest.fn()

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
        SAME: {
          b: {
            actions: ['sameStateMethod', sameStateFn]
          }
        }
      },
      onEntry: ['actionMethod', actionFunction],
      activities: ['activityMethod'],
    },
  },
}

test('statechart', () => {
  const Component = () => <div />
  const StateMachine1 = withStateMachine(statechart)(Component)
  const StateMachine2 = withStateMachine(Machine(statechart))(Component)
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
  const StateMachine = withStateMachine(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  spy.mockClear()
  instance.handleTransition('FOO')

  expect(spy).not.toHaveBeenCalled()

  instance.handleTransition('EVENT')

  expect(spy).toHaveBeenCalled()
})

test('invalid transition with extended state', () => {
  const Component = () => <div />
  const StateMachine = withStateMachine(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('FOO', { foo: 'bar' })

  expect(() => {
    instance.handleTransition('FOO')
  }).not.toThrow()
})

test('props', () => {
  const Component = () => <div />
  const StateMachine = withStateMachine(statechart)(Component)
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
  const StateMachine = withStateMachine(statechart)(Component)
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
  const sameStateMethod = jest.fn()

  class Component extends React.Component {
    actionMethod(...args) {
      actionMethod(...args)
    }

    activityMethod(...args) {
      activityMethod(...args)
    }

    sameStateMethod(...args) {
      sameStateMethod(...args)
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStateMachine(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(actionMethod).toHaveBeenCalledTimes(1)
  expect(actionMethod).toHaveBeenCalledWith(undefined, 'EVENT')
  expect(actionFunction).toHaveBeenCalledTimes(1)
  expect(actionFunction).toHaveBeenCalledWith(undefined, 'EVENT')
  expect(activityMethod).toHaveBeenCalledTimes(1)
  expect(activityMethod).toHaveBeenCalledWith(true)
  expect(sameStateFn).not.toHaveBeenCalled()
  expect(sameStateMethod).not.toHaveBeenCalled()

  instance.handleTransition('SAME')
  expect(actionMethod).toHaveBeenCalledTimes(2)
  expect(actionMethod).toHaveBeenCalledWith(undefined, 'EVENT')
  expect(actionFunction).toHaveBeenCalledTimes(2)
  expect(actionFunction).toHaveBeenCalledWith(undefined, 'EVENT')
  /* WIP - should the activity method have been called two or three times? */
  expect(activityMethod).toHaveBeenCalledTimes(3)
  expect(activityMethod).toHaveBeenCalledWith(true)

  expect(sameStateFn).toHaveBeenCalledTimes(1)
  expect(sameStateMethod).toHaveBeenCalledTimes(1)
})

test('lifecycle hooks', () => {
  const willTransition = jest.fn()
  const didTransition = jest.fn()

  class Component extends React.Component {
    componentWillTransition(...args) {
      willTransition(...args)
    }

    componentDidTransition(...args) {
      didTransition(...args)
    }

    render() {
      return <div />
    }
  }

  const StateMachine = withStateMachine(statechart)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition('EVENT')

  expect(willTransition).toHaveBeenCalledWith('EVENT')
  expect(didTransition).toHaveBeenCalledWith(
    expect.objectContaining({ value: 'a' }),
    'EVENT'
  )

  willTransition.mockClear()
  didTransition.mockClear()
  instance.handleTransition('FOO')

  expect(willTransition).toHaveBeenCalled()
  expect(didTransition).not.toHaveBeenCalled()
})
