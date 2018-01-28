[![npm](https://img.shields.io/npm/v/react-automata.svg)](https://www.npmjs.com/package/react-automata)
[![Build Status](https://travis-ci.org/MicheleBertoli/react-automata.svg?branch=master)](https://travis-ci.org/MicheleBertoli/react-automata)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# React Automata

A state machine abstraction for React that provides declarative state management and automatic test generation.

# Quick Start

## Installation

```sh
yarn add react-automata
```

## Usage

```js
// App.js

import React from 'react'
import { Action, withStatechart } from 'react-automata'

export const statechart = {
  initial: 'a',
  states: {
    a: {
      on: {
        NEXT: 'b',
      },
      onEntry: 'enterA',
    },
    b: {
      on: {
        NEXT: 'a',
      },
      onEntry: 'enterB',
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
        <Action show="enterA">Hello, A</Action>
        <Action show="enterB">Ciao, B</Action>
      </div>
    )
  }
}

export default withStatechart(statechart)(App)
```

```js
// App.spec.js

import { testStatechart } from 'react-automata'
import { App, statechart } from './App'

test('it works', () => {
  testStatechart({ statechart }, App)
})
```

```js
// App.spec.js.snap

exports[`it works: a 1`] = `
<div>
  <button
    onClick={[Function]}
  >
    NEXT
  </button>
  Hello, A
</div>
`;

exports[`it works: b 1`] = `
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

## withStatechart(statechart[, options])(Component)

The `withStatechart` higher-order component takes a statechart (see [xstate](https://github.com/davidkpiano/xstate)), some [options](#options) and a component.
It returns a new component with special [props](#props), [action methods](#action-methods) and [lifecycle hooks](#lifecycle-hooks).
The initial machine state and the initial data can be passed to the resulting component through the `initialMachineState` and `initialData` props.

### Options

| Option | Type | Description |
| ------ | ---- | ----------- |
| devTools | bool | To connect the state machine to the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension). |

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
Using this value is discouraged, as it couples the UI and the state machine.

```js
<button onClick={this.handleClick}>
  {this.props.machineState === 'idle' ? 'Fetch' : 'Retry'}
</button>
```

### Action methods

All the component's methods whose names match the names of the actions, are fired when the related transition happen.
For example:

```js
const statechart = {
  // ...
  fetching: {
    on: {
      SUCCESS: 'success',
      ERROR: 'error',
    },
    onEntry: 'fetchGists',
  },
  // ...
}

class App extends React.Component {
  // ...
  fetchGists() {
    fetch('https://api.github.com/users/gaearon/gists')
      .then(response => response.json())
      .then(gists => this.props.transition('SUCCESS', { gists }))
      .catch(() => this.props.transition('ERROR'))
  }
  // ...
}

```

### Lifecycle hooks

#### componentWillTransition(event)

The lifecycle method invoked when a transition is about to happen.
It provides the event, and can be used to run side-effects.

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

## &lt;Action /&gt;

The component to define which parts of the tree should be rendered for a given action (or set of actions).

| Prop | Type | Description |
| ---- | ---- | ----------- |
| children | node | The children to be rendered when the conditions match. |
| hide | oneOfType(string, arrayOf(string)) | The action(s) for which the children should be hidden. |
| render | func | The [render prop](https://reactjs.org/docs/render-props.html) receives a bool (true when the conditions match) and it takes precedence over children. |
| show | oneOfType(string, arrayOf(string)) | The action(s) for which the children should be shown. When both `show` and `hide` are defined, the children are shown from the first `show` match to the first `hide` match. |
| onEnter | func | The function invoked when the component becomes visible. |
| onLeave | func | The function invoked when the component becomes invisible. |

```js
<Action show="enterError">Oh, snap!</Action>
```

```js
<Action
  show="enterError"
  render={visible => (visible ? <div>Oh, snap!</div> : null)}
/>
```

## &lt;State /&gt;

The component to define which parts of the tree should be rendered for a given state (or set of states).

| Prop | Type | Description |
| ---- | ---- | ----------- |
| children | node | The children to be rendered when the conditions match. |
| render | func | The [render prop](https://reactjs.org/docs/render-props.html) receives a bool (true when the conditions match) and it takes precedence over children. |
| value | oneOfType(string, arrayOf(string)) | The state(s) for which the children should be shown. It accepts the exact state, a glob expression or an array of states/expressions (e.g. `value="idle"`, `value="error.*"` or `value={['idle', 'error.*']`). |
| onEnter | func | The function invoked when the component becomes visible. |
| onLeave | func | The function invoked when the component becomes invisible. |

```js
<State value="error">Oh, snap!</State>
```

```js
<State
  value="error"
  render={visible => (visible ? <div>Oh, snap!</div> : null)}
/>
```

## testStatechart({ statechart[, fixtures] }, Component)

The method to automagically generate tests given a statechart definition, and a component.
It accepts an optional `fixtures` configuration to describe which data should be injected into the component for a given transition.

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
  testStatechart({ statechart, fixtures }, App)
})
```

# Examples

- [Ian Horrocks's Calculator](https://codesandbox.io/s/n5vvn4jrpm)

- [React Flickr Gallery App](https://codesandbox.io/s/z20llylz9l)

- [Playground](./playground)

# Inspiration

[Federico](https://twitter.com/gandellinux), for telling me "Hey, I think building UIs using state machines is the future".

[David](https://twitter.com/DavidKPiano), for giving a very informative (and fun) [talk](https://www.youtube.com/watch?v=VU1NKX6Qkxc) about infinitely better UIs, and building [xstate](https://github.com/davidkpiano/xstate).

[Ryan](https://twitter.com/ryanflorence), for [experimenting](https://www.youtube.com/watch?v=MkdV2-U16tc) with xstate and React - Ryan's approach to React has always been a source of inspiration.

[Erik](https://twitter.com/mogsie), for writing about [statecharts](https://statecharts.github.io/), and showing me how to keep UI and state machine decoupled.
