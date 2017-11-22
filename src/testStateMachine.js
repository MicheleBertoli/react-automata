import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateMachine } from './'

let visitedStates

const transition = (renderer, machineState, action, fixtures) => {
  const instance = renderer.getInstance()
  instance.setState({ machineState })

  if (action) {
    instance.handleTransition(action, fixtures)
  }

  return instance.state.machineState
}

const moveToNextState = (config, Component, machineState) => {
  visitedStates.push(machineState)

  machineState.split('.').reduce((states, state) => {
    const { on: actions = {} } = states[state]

    Object.keys(actions).forEach(action => {
      if (!visitedStates.includes(actions[action])) {
        toMatchSnapshot(config, Component, machineState, action)
      }
    })

    return states[state].states
  }, config.machine.states)
}

const toMatchSnapshot = (config, Component, machineState, action) => {
  const StateMachine = withStateMachine(config.machine)(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const fixtures =
    config.fixtures && config.fixtures[machineState]
      ? config.fixtures[machineState][action]
      : null
  const nextMachineState = transition(renderer, machineState, action, fixtures)

  expect(renderer.toJSON()).toMatchSnapshot(nextMachineState)
  moveToNextState(config, Component, nextMachineState)
}

const testStateMachine = (config, Component) => {
  visitedStates = []
  toMatchSnapshot(config, Component, config.machine.initial)
}

export default testStateMachine
