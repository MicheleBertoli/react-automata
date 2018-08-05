import React from 'react'
import TestRenderer from 'react-test-renderer'
import { getShortestPaths } from 'xstate/lib/graph'
import idx from 'idx'
import { stringify } from './utils'

const testStateMachine = (Component, options = {}) => {
  const { machine } = TestRenderer.create(<Component />).getInstance()
  const paths = getShortestPaths(machine, options.extendedState)

  Object.keys(paths).forEach(key => {
    const initialData = idx(options, _ => _.fixtures.initialData)
    const renderer = TestRenderer.create(
      <Component initialData={initialData} />
    )
    const instance = renderer.getInstance()

    paths[key].forEach(({ event, state }) => {
      const fixtures = idx(options, _ => _.fixtures[state][event])

      instance.handleTransition(event, fixtures)
    })

    const machineState =
      instance.state.machineState.toString() ||
      stringify(instance.state.machineState.value)

    expect(renderer.toJSON()).toMatchSnapshot(undefined, machineState)
  })
}

export default testStateMachine
