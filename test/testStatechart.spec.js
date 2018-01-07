import React from 'react'
import { Action, State, testStatechart } from '../src'

const secondMachine = {
  initial: 'a',
  states: {
    a: {
      on: {
        SECOND_NEXT: 'b',
      },
      onEntry: 'enterBA',
    },
    b: {
      on: {
        SECOND_NEXT: 'a',
      },
      onEntry: 'enterBB',
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
      onEntry: 'enterB',
      ...secondMachine,
    },
  },
}

test('action', () => {
  const App = () => (
    <div>
      <Action initial hide="enterB">
        a
      </Action>
      <Action show="enterBA">b.a</Action>
      <Action show="enterBB">b.b</Action>
    </div>
  )

  testStatechart({ statechart: firstMachine }, App)
})

test('state', () => {
  const App = () => (
    <div>
      <State value="a">a</State>
      <State value="b.a">b.a</State>
      <State value="b.b">b.b</State>
    </div>
  )

  testStatechart({ statechart: firstMachine }, App)
})
