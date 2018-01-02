import React from 'react'
import { Action, State, testStatechart } from '../src'

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

test('action', () => {
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
