import idx from 'idx'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { getShortestPaths } from 'xstate/lib/graph'
import { stringify } from 'react-automata-utilities'

const testStateMachine = (Component, options = {}) => {
  const paths = getShortestPaths(Component.machine, options.extendedState)

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
      stringify(instance.state.machineState.value).join(',')

    expect(renderer.toJSON()).toMatchSnapshot(machineState)
  })
}

export default testStateMachine
