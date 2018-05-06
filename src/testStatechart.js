import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { getShortestPaths } from 'xstate/lib/graph'
import idx from 'idx'
import invariant from 'invariant'
import { getContextValue } from './utils'
import withStatechart from './withStatechart'

const testStatechart = (config, Component) => {
  invariant(
    !Component.isStateMachine,
    `It seems you are testing a component wrapped into \`withStatechart\`, please use a base component instead.
    See https://github.com/MicheleBertoli/react-automata/issues/46`
  )

  const { channel, statechart } = config
  const machine = Machine(statechart)
  const paths = getShortestPaths(machine)

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
