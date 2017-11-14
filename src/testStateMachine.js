import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateMachine } from '../src'

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
  const { on: actions } = config.machine.states[machineState]

  if (actions) {
    Object.keys(actions).forEach(action => {
      if (!visitedStates.includes(actions[action])) {
        toMatchSnapshot(config, Component, machineState, action)
      }
    })
  }
}

const toMatchSnapshot = (config, Component, machineState, action) => {
  const StateMachine = withStateMachine(config.machine)(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const nextMachineState = transition(
    renderer,
    machineState,
    action,
    config.fixtures[machineState] ? config.fixtures[machineState][action] : null
  )

  expect(renderer.toJSON()).toMatchSnapshot(nextMachineState)
  moveToNextState(config, Component, nextMachineState)
}

const testStateMachine = (config, Component) => {
  visitedStates = []
  toMatchSnapshot(config, Component, config.machine.initial)
}

export default testStateMachine
