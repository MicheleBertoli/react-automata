import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Machine } from 'xstate'
// import { getShortestPaths } from 'xstate/lib/graph'
import { withStateChart } from './'

const getShortestPaths = () => ({
  a: [],
  'b.a': [{ state: 'a', event: 'FIRST_NEXT' }],
  'b.b': [
    { state: 'a', event: 'FIRST_NEXT' },
    { state: 'b.a', event: 'SECOND_NEXT' },
  ],
})

const testStateChart = (config, Component) => {
  const paths = getShortestPaths(Machine(config.statechart))

  Object.keys(paths).forEach(key => {
    const initialData = config.fixtures ? config.fixtures.initialData : null
    const StateMachine = withStateChart(config.statechart, { initialData })(
      Component
    )
    const renderer = TestRenderer.create(<StateMachine />)
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures =
        config.fixtures && config.fixtures[state]
          ? config.fixtures[state][event]
          : null

      instance.handleTransition(event, fixtures)
    })

    expect(renderer.toJSON()).toMatchSnapshot(key)
  })
}

export default testStateChart
