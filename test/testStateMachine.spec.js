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
    <State name="a">a</State>
    <State name="b.a">b.a</State>
    <State name="b.b">b.b</State>
  </div>
)

test('it works', () => {
  testStateMachine({ machine: firstMachine }, App)
})
