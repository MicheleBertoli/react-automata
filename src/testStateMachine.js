import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withStateChart } from './'

let visitedStates

const transition = (renderer, machineState, event, fixtures) => {
  const instance = renderer.getInstance()
  instance.setState({ machineState })

  if (event) {
    instance.handleTransition(event, fixtures)
  }

  return instance.state.machineState
}

const moveToNextState = (config, Component, machineState) => {
  visitedStates.push(machineState)

  machineState.split('.').reduce((states, state) => {
    const { on: events = {} } = states[state]

    Object.keys(events).forEach(event => {
      if (!visitedStates.includes(events[event])) {
        toMatchSnapshot(config, Component, machineState, event)
      }
    })

    return states[state].states
  }, config.statechart.states)
}

const toMatchSnapshot = (config, Component, machineState, event) => {
  const initialData = config.fixtures ? config.fixtures.initialData : null
  const StateMachine = withStateChart(config.statechart, { initialData })(
    Component
  )
  const renderer = TestRenderer.create(<StateMachine />)
  const fixtures =
    config.fixtures && config.fixtures[machineState]
      ? config.fixtures[machineState][event]
      : null
  const nextMachineState = transition(renderer, machineState, event, fixtures)

  expect(renderer.toJSON()).toMatchSnapshot(nextMachineState)
  moveToNextState(config, Component, nextMachineState)
}

const testStateMachine = (config, Component) => {
  visitedStates = []
  toMatchSnapshot(config, Component, config.statechart.initial)
}

export default testStateMachine
