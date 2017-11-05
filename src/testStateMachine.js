import React from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'

const createContext = (context, Component) => {
  class Context extends React.Component {
    getChildContext() {
      return { ...context }
    }

    render() {
      return <Component />
    }
  }

  Context.childContextTypes = {
    machineState: PropTypes.string,
  }

  return Context
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
    Object.values(actions).forEach(state => {
      toMatchSnapshot(config, Component, state)
    })
  }
}

const toMatchSnapshot = (config, Component, machineState) => {
  const Context = createContext({ machineState }, Component)
  const renderer = TestRenderer.create(<Context />)
  injectState(renderer, Component, config.fixtures[machineState])
  expect(renderer.toJSON()).toMatchSnapshot(machineState)
  moveToNextState(config, Component, machineState)
}

const testStateMachine = (config, Component) => {
  toMatchSnapshot(config, Component, config.machine.initial)
}

export default testStateMachine
