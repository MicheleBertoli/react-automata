import React from 'react'
import { Section, testStateMachine } from '../src'

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
    <Section initial hide="onEnterB">
      a
    </Section>
    <Section show="onEnterBA" hide="onEnterBB">
      b.a
    </Section>
    <Section show="onEnterBB">b.b</Section>
  </div>
)

test('it works', () => {
  testStateMachine({ statechart: firstMachine }, App)
})
