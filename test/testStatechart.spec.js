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
        ...secondMachine,
      },
    },
  }

  test('action', () => {
    const App = () => (
      <div>
        <Action is="enterA">a</Action>
        <Action is="enterBA">b.a</Action>
        <Action is="enterBB">b.b</Action>
      </div>
    )

    testStatechart({ statechart: firstMachine }, App)
  })

  test('state', () => {
    const App = () => (
      <div>
        <State is="a">a</State>
        <State is="b.a">b.a</State>
        <State is="b.b">b.b</State>
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
      <State is="bold.on">bold.on</State>
      <State is="bold.off">bold.off</State>
      <State is="underline.on">underline.on</State>
      <State is="underline.off">underline.off</State>
      <State is="italics.on">italics.on</State>
      <State is="italics.off">italics.off</State>
      <State is="list.none">list.none</State>
      <State is="list.bullets">list.bullets</State>
      <State is="list.numbers">list.numbers</State>
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
      <State channel="inner" is="inner">
        inner
      </State>
      <State channel="outer" is="outer">
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
      <State channel="outer" is="outer">
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
      <State is="a">A</State>
      <State is="b">B</State>
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
