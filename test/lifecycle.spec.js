import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateMachine } from '../src'

test('lifecycle hooks work', () => {
  const initialState = 'a'
  const actionName = 'ACTION'

  const machine = {
    initial: initialState,
    states: {
      [initialState]: {
        on: {
          [actionName]: 'b',
        },
      },
      b: {},
    },
  }

  const spy = jest.fn()

  class App extends React.Component {
    componentWillTransition(action) {
      spy(action)
    }

    componentDidTransition(prevState, action) {
      spy(prevState, action)
    }

    render() {
      return null
    }
  }

  const StateMachine = withStateMachine(machine)(App)

  const instance = TestRenderer.create(<StateMachine />).getInstance()
  instance.handleTransition(actionName)

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith(actionName)
  expect(spy).toHaveBeenLastCalledWith(initialState, actionName)
})
