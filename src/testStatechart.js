import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { getShortestPaths } from 'xstate/lib/graph'
import idx from 'idx'
import { getContextValue } from './utils'
import withStatechart from './withStatechart'

const testStatechart = (config, Component) => {
  const paths = getShortestPaths(Machine(config.statechart))

  Object.keys(paths).forEach(key => {
    const initialData = idx(config, _ => _.fixtures.initialData)
    const StateMachine = withStatechart(config.statechart)(Component)
    const renderer = TestRenderer.create(
      <StateMachine initialData={initialData} />
    )
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures = idx(config, _ => _.fixtures[state][event])

      instance.handleTransition(event, fixtures)
    })

    const { machineState } = getContextValue({}, instance.getChildContext())

    expect(renderer.toJSON()).toMatchSnapshot(machineState)
  })
}

export default testStatechart
