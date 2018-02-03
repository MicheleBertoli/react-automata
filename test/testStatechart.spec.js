import React from 'react'
import { Action, State, testStatechart, withStatechart } from '../src'

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
      onEntry: 'enterA',
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
      <Action show="enterA" hide="enterB">
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

test('parallel', () => {
  const wordMachine = {
    parallel: true,
    states: {
      bold: {
        initial: 'off',
        states: {
          on: {
            on: { TOGGLE_BOLD: 'off' },
          },
          off: {
            on: { TOGGLE_BOLD: 'on' },
          },
        },
      },
      underline: {
        initial: 'off',
        states: {
          on: {
            on: { TOGGLE_UNDERLINE: 'off' },
          },
          off: {
            on: { TOGGLE_UNDERLINE: 'on' },
          },
        },
      },
      italics: {
        initial: 'off',
        states: {
          on: {
            on: { TOGGLE_ITALICS: 'off' },
          },
          off: {
            on: { TOGGLE_ITALICS: 'on' },
          },
        },
      },
      list: {
        initial: 'none',
        states: {
          none: {
            on: { BULLETS: 'bullets', NUMBERS: 'numbers' },
          },
          bullets: {
            on: { NONE: 'none', NUMBERS: 'numbers' },
          },
          numbers: {
            on: { BULLETS: 'bullets', NONE: 'none' },
          },
        },
      },
    },
  }

  const App = () => (
    <div>
      <State value="bold.on">bold.on</State>
      <State value="bold.off">bold.off</State>
      <State value="underline.on">underline.on</State>
      <State value="underline.off">underline.off</State>
      <State value="italics.on">italics.on</State>
      <State value="italics.off">italics.off</State>
      <State value="list.none">list.none</State>
      <State value="list.bullets">list.bullets</State>
      <State value="list.numbers">list.numbers</State>
    </div>
  )

  testStatechart({ statechart: wordMachine }, App)
})

test('channel', () => {
  const inner = {
    key: 'inner',
    initial: 'b',
    states: {
      b: {},
    },
  }

  const Inner = () => (
    <div>
      <State channel="inner" value="b">
        b
      </State>
      <State value="a">a</State>
    </div>
  )

  const InnerMachine = withStatechart(inner)(Inner)

  const outer = {
    initial: 'a',
    states: {
      a: {},
    },
  }

  const App = () => (
    <div>
      <State value="a">a</State>
      <InnerMachine />
    </div>
  )

  testStatechart({ statechart: outer }, App)
})
