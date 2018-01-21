import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { getShortestPaths } from 'xstate/lib/graph'
import { withStatechart } from './'

const testStatechart = (config, Component) => {
  const paths = getShortestPaths(Machine(config.statechart))

  Object.keys(paths).forEach(key => {
    const StateMachine = withStatechart(config.statechart)(Component)
    const renderer = TestRenderer.create(<StateMachine />)
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures =
        config.fixtures && config.fixtures[state]
          ? config.fixtures[state][event]
          : null

      instance.handleTransition(event, fixtures)
    })

    const { machineState } = instance.getChildContext()

    expect(renderer.toJSON()).toMatchSnapshot(machineState)
  })
}

export default testStatechart
