[![Build Status](https://travis-ci.org/MicheleBertoli/react-automata.svg?branch=master)](https://travis-ci.org/MicheleBertoli/react-automata)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> This is a work in progress

# React Automata

If components' state is deterministic, tests can be automagically generated.

# Quick Start

## Installation

```sh
yarn add react-automata
```

## Usage

```js
// App.js

import React from 'react'
import { State, withStateMachine } from 'react-automata'

export const machine = {
  initial: 'a',
  states: {
    a: {
      on: {
        NEXT: 'b',
      },
    },
    b: {
      on: {
        NEXT: 'a',
      },
    },
  },
}

export class App extends React.Component {
  handleClick = () => {
    this.props.transition('NEXT')
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>NEXT</button>
        <State value="a">Hello, A</State>
        <State value="b">Ciao, B</State>
      </div>
    )
  }
}

export default withStateMachine(machine)(App)
```

```js
// App.spec.js

import { testStateMachine } from 'react-automata'
import { App, machine } from './App'

test('it works', () => {
  testStateMachine({ machine }, App)
})
```

```js
// App.spec.js.snap

exports[`a 1`] = `
<div>
  <button
    onClick={[Function]}
  >
    NEXT
  </button>
  Hello, A
</div>
`;

exports[`b 1`] = `
<div>
  <button
    onClick={[Function]}
  >
    NEXT
  </button>
  Ciao, B
</div>
`;
```

# API

## withStateMachine(machine[, options])(Component)

The `withStateMachine` higher-order component takes a state machine definition (see [xstate](https://github.com/davidkpiano/xstate)), some optional [options](#options) and a component.
It returns a new component with special [props](#props) and [lifecycle methods](#lifecycle-methods).

> This package works with regular and nested state machines - parallel state machines are not supported yet.

### Options

| Option | Type | Description |
| ------ | ---- | ----------- |
| devTools | bool | To connect the state machine to the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension). |
| initialData | object | The initial data, passed to the component as props. |

### Props

#### transition(event[, updater])

The method to change the state of the state machine.
It takes an optional updater function that receives the previous data and returns a data change.
The updater can also be an object, which gets merged into the current data.

```js
handleClick = () => {
  this.props.transition('FETCH')
}
```

#### machineState

The current state of the state machine.

```js
<button onClick={this.handleClick}>
  {this.props.machineState === 'idle' ? 'Fetch' : 'Retry'}
</button>
```

### Lifecycle methods

#### componentWillTransition(event)

The lifecycle method invoked when a transition is about to happen.
It provides the event, and it is the place to run side-effects.

```js
componentWillTransition(event) {
  if (event === 'FETCH') {
    fetch('https://api.github.com/users/gaearon/gists')
      .then(response => response.json())
      .then(gists => this.props.transition('SUCCESS', { gists }))
      .catch(() => this.props.transition('ERROR'))
  }
}
```

#### componentDidTransition(prevStateMachine, event)

The lifecycle method invoked when a transition has happened and the state is updated.
It provides the previous state machine, and the event.
The current `machineState` is available in `this.state`.

```js
componentDidTransition(prevStateMachine, event) {
  Logger.log(event)
}
```

## State

The component to define which parts of the tree should be rendered for a given state (or set of states).

| Prop | Type | Description |
| ---- | ---- | ----------- |
| value  | oneOfType(string, arrayOf(string))  | The state(s) for which the children should be shown. It accepts the exact state, a glob expression or an array of states/expressions (e.g. `value="idle"`, `value="error.*"` or  `value={['idle', 'error.*']`). |
| onEnter(machineState)  | func  | The function invoked when the component becomes visible, it provides the current machine state. |
| onLeave(machineState)  | func  | The function invoked when the component becomes invisible, it provides the current machine state. |

```js
<State value="error">Oh, snap!</State>
```

## testStateMachine({ machine[, fixtures] }, Component)

The method to automagically generate tests given a state machine definition, and a component.
It accepts an optional `fixtures` configuration to describe which data that should be injected into the component for a given transition.

```js
const fixtures = {
  initialData: {
    gists: [],
  },
  fetching: {
    SUCCESS: {
      gists: [
        {
          id: 'ID1',
          description: 'GIST1',
        },
        {
          id: 'ID2',
          description: 'GIST2',
        },
      ],
    },
  },
}

test('it works', () => {
  testStateMachine({ machine, fixtures }, App)
})
```

# Inspiration

[Federico](https://twitter.com/gandellinux), for telling me "Hey, I think building UIs using state machines is the future".

[David](https://twitter.com/DavidKPiano), for giving a very informative (and fun) [talk](https://www.youtube.com/watch?v=VU1NKX6Qkxc) about infinitely better UIs, and building [xstate](https://github.com/davidkpiano/xstate).

[Ryan](https://twitter.com/ryanflorence), for [experimenting](https://www.youtube.com/watch?v=MkdV2-U16tc) with xstate and React - Ryan's approach to React has always been a source of inspiration to me.
