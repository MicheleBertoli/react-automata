import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateMachine } from '../src'

const transition = (renderer, machineState, action) => {
  const instance = renderer.getInstance()
  instance.setState({ machineState })

  if (action) {
    instance.handleTransition(action)
  }

  return instance.state.machineState
}

const injectState = (renderer, Component, fixtures) => {
  if (fixtures) {
    const { instance } = renderer.root.findByType(Component)
    instance.setState(fixtures)
  }
}

const moveToNextState = (config, Component, machineState) => {
  const { on: actions } = config.machine.states[machineState]

  if (actions) {
    Object.keys(actions).forEach(action => {
      toMatchSnapshot(config, Component, machineState, action)
    })
  }
}

const toMatchSnapshot = (config, Component, machineState, action) => {
  const StateMachine = withStateMachine(config.machine)(Component)
  const renderer = TestRenderer.create(<StateMachine />)
  const nextMachineState = transition(renderer, machineState, action)

  injectState(renderer, Component, config.fixtures[nextMachineState])
  expect(renderer.toJSON()).toMatchSnapshot(nextMachineState)
  moveToNextState(config, Component, nextMachineState)
}

const testStateMachine = (config, Component) => {
  toMatchSnapshot(config, Component, config.machine.initial)
}

export default testStateMachine
