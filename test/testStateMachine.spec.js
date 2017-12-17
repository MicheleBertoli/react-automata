import React from 'react'
import { State, testStateMachine } from '../src'

const secondMachine = {
  initial: 'a',
  states: {
    a: {
      on: {
        SECOND_NEXT: 'b',
      },
    },
    b: {
      on: {
        SECOND_NEXT: 'a',
      },
    },
  },
}

const firstMachine = {
  initial: 'a',
  states: {
    a: {
      on: {
        FIRST_NEXT: 'b',
      },
    },
    b: {
      on: {
        FIRST_NEXT: 'a',
      },
      ...secondMachine,
    },
  },
}

const App = () => (
  <div>
    <State value="a">a</State>
    <State value="b.a">b.a</State>
    <State value="b.b">b.b</State>
  </div>
)

test('it works', () => {
  testStateMachine({ machine: firstMachine }, App)
})
