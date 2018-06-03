import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
import { getShortestPaths } from 'xstate/lib/graph'
import idx from 'idx'
import invariant from 'invariant'
import { getContextValue } from './utils'
import withStatechart from './withStatechart'

const testStatechart = (options, Component) => {
  invariant(
    !Component.isStateMachine,
    `It seems you are testing a component wrapped into \`withStatechart\`, please use a base component instead.
    See https://github.com/MicheleBertoli/react-automata/issues/46`
  )

  const { statechart, extendedState, channel } = options
  const machine = Machine(statechart)
  const paths = getShortestPaths(machine, extendedState)

  Object.keys(paths).forEach(key => {
    const initialData = idx(options, _ => _.fixtures.initialData)
    const StateMachine = withStatechart(statechart, { channel })(Component)
    const renderer = TestRenderer.create(
      <StateMachine initialData={initialData} />
    )
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures = idx(options, _ => _.fixtures[state][event])

      instance.handleTransition(event, fixtures)
    })

    const { machineState } = getContextValue(
      instance.getChildContext(),
      channel
    )

    expect(renderer.toJSON()).toMatchSnapshot(undefined, machineState)
  })
}

export default testStatechart
