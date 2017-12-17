import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateMachine } from '../src'

const initiaState = 'a'
const action = 'ACTION'

const machine = {
  initial: initiaState,
  states: {
    [initiaState]: {
      on: {
        [action]: 'b',
      },
    },
    b: {
      on: {
        [action]: initiaState,
      },
    },
  },
}

test('state', () => {
  const initialData = { counter: 0 }
  const Component = () => <div />
  const StateMachine = withStateMachine(machine, { initialData })(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const instance = renderer.getInstance()
  const component = renderer.root.findByType(Component)

  expect(component.props.counter).toBe(0)

  instance.handleTransition(action, { counter: 1 })

  expect(component.props.counter).toBe(1)

  instance.handleTransition(action, prevState => ({
    counter: prevState.counter + 1,
  }))

  expect(component.props.counter).toBe(2)
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

  const StateMachine = withStateMachine(machine)(Component)
  const instance = TestRenderer.create(<StateMachine />).getInstance()

  instance.handleTransition(action)

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith(action)
  expect(spy).toHaveBeenLastCalledWith(initiaState, action)
})
