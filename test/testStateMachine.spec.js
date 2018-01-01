import React from 'react'
import { Action, testStateMachine } from '../src'

const secondMachine = {
  initial: 'a',
  states: {
    a: {
      on: {
        SECOND_NEXT: 'b',
      },
      onEntry: 'onEnterBA',
    },
    b: {
      on: {
        SECOND_NEXT: 'a',
      },
      onEntry: 'onEnterBB',
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
      onEntry: 'onEnterB',
      ...secondMachine,
    },
  },
}

const App = () => (
  <div>
    <Action initial hide="onEnterB">
      a
    </Action>
    <Action show="onEnterBA" hide="onEnterBB">
      b.a
    </Action>
    <Action show="onEnterBB">b.b</Action>
  </div>
)

test('it works', () => {
  testStateMachine({ statechart: firstMachine }, App)
})
