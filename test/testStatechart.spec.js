import React from 'react'
import { Action, State, testStatechart, withStatechart } from '../src'

describe('conditional', () => {
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

test('channels', () => {
  const inner = {
    initial: 'inner',
    states: {
      inner: {},
    },
  }
  const Inner = () => (
    <div>
      <State channel="inner" value="inner">
        inner
      </State>
      <State channel="outer" value="outer">
        outer
      </State>
    </div>
  )
  const InnerMachine = withStatechart(inner, { channel: 'inner' })(Inner)

  const outer = {
    initial: 'outer',
    states: {
      outer: {},
    },
  }
  const Outer = () => (
    <div>
      <State channel="outer" value="outer">
        outer
      </State>
      <InnerMachine />
    </div>
  )

  testStatechart({ statechart: outer, channel: 'outer' }, Outer)
})

describe('cond', () => {
  const statechart = {
    initial: 'a',
    states: {
      a: {
        on: {
          EVENT: {
            b: {
              cond: extState => extState.shouldPass,
            },
          },
        },
      },
      b: {},
    },
  }

  const Cond = () => (
    <React.Fragment>
      <State value="a">A</State>
      <State value="b">B</State>
    </React.Fragment>
  )

  test('pass', () => {
    const extendedState = {
      shouldPass: true,
    }
    const fixtures = {
      a: {
        EVENT: extendedState,
      },
    }

    testStatechart({ statechart, fixtures, extendedState }, Cond)
  })

  test('fail', () => {
    testStatechart({ statechart }, Cond)
  })
})
