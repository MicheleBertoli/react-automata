import React from 'react'
import { Block, testStateMachine } from '../src'

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
    <Block initial hide="onEnterB">
      a
    </Block>
    <Block show="onEnterBA" hide="onEnterBB">
      b.a
    </Block>
    <Block show="onEnterBB">b.b</Block>
  </div>
)

test('it works', () => {
  testStateMachine({ statechart: firstMachine }, App)
})
