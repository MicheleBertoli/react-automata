import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { getShortestPaths } from 'xstate/lib/graph'
import idx from 'idx'
import { getContextValue } from './utils'
import withStatechart from './withStatechart'

const testStatechart = (config, Component) => {
  const { channel, statechart } = config
  const paths = getShortestPaths(Machine(statechart))

  Object.keys(paths).forEach(key => {
    const initialData = idx(config, _ => _.fixtures.initialData)
    const StateMachine = withStatechart(statechart, { channel })(Component)
    const renderer = TestRenderer.create(
      <StateMachine initialData={initialData} />
    )
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures = idx(config, _ => _.fixtures[state][event])

      instance.handleTransition(event, fixtures)
    })

    const { machineState } = getContextValue(
      instance.getChildContext(),
      channel
    )

    expect(renderer.toJSON()).toMatchSnapshot(machineState)
  })
}

export default testStatechart
