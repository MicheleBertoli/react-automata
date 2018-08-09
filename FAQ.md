# Frequently Asked Questions

## How do I do X with `react-automata`?

In most of the cases, the answer is: the same way you would do X with `react`.

In fact, this library is meant to be a thin bridge between `xstate` and `react` and it intentionally doesn't provide any new paradigm or approach, except for the state machine concepts.

The advantage of using `react-automata` is to get a component "connected" to a state machine which can react to [actions and activities](https://github.com/MicheleBertoli/react-automata#action-and-activity-methods).
Once the state machine component is in your tree, feel free to use your favourite `react` technique to build your application.

## Should I wrap all my components into `withStateMachine`?

Only the components wrapped into the [higher-order component](https://reactjs.org/docs/higher-order-components.html) receive the transition function, the lifecycle hooks and react to action and activity methods.

However, you can use `react` props to tell other components down in the tree to perform operations.

```js
// MyStateMachine.js

myAction() {
  this.setState({
    shouldRunSideEffect: true,
  })
}

render() {
  return <MyComponent shouldRunSideEffect={this.state.shouldRunSideEffect} />
}
```

```js
// MyComponent.js

componentDidUpdate() {
  if (this.props.shouldRunSideEffect) {
    this.mySideEffect()
  }
}
```

Alternatively, you can take advantage of the [Action](https://github.com/MicheleBertoli/react-automata#action-) and [State](https://github.com/MicheleBertoli/react-automata#state-) components to show/hide the children according to the state of the state machine.

```js
render() {
  return (
    <Action is="myAction">
      This is shown when the current action is myAction.
    </Action>
  )
}
```

Another way to share the transition function and the machine state with the rest of the tree is using the new [Context API](https://reactjs.org/docs/context.html).

```js
const AutomataContext = React.createContext()

const MyStateMachine = props => (
  <AutomataContext.Provider value={props}>
    <MyComponent />
  </AutomataContext.Provider>
)

const MyComponent = () => (
  <AutomataContext.Consumer>
    {({ machineState, transition }) => // ...
  </AutomataContext.Consumer>
)
```

## Does `react-automata` work with `redux`?

The first thing to consider is that [you might not need redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367), but if you want to experiment with `redux` and statecharts I suggest reading [this](https://medium.freecodecamp.org/how-to-model-the-behavior-of-redux-apps-using-statecharts-5e342aad8f66).

Anyway, it's possible to use `redux` with `react-automata` and the recommended approach is to connect the state machine component and run `redux` actions on state machine actions.

```js
myStateMachineAction() {
  this.props.dispatch(myReduxAction())
}
```

You can also take advantage of the lifecycle hooks and dispatch all the state machine actions.

```js
componentDidTransition(event) {
  this.props.dispatch(event)
}
```

## Can I reuse an existing `xstate` machine?

If you have an existing machine and you want to reuse it, you can pass it to the higher-order component and `react-automata` will use it to calculate states and transitions.

```js
const machine = Machine({
  // ...
})

const MyStateMachine = withStateMachine(machine)(MyComponent)
```

In case you are passing an existing machine to the higher-order component, you might want to consider initialising its state with the `initialMachineState` prop.

```js
<MyStateMachine initialMachineState={State.from('myState')} />
```

## What if I want to nest `react-automata` components?

It's totally possible, you only have to use a different channel option/prop for each one of them so that the contexts don't interfere with each other.

```js
const MyOuterStateMachine = withStateMachine(statechart, { channel: 'outer' })(
  MyComponent
)
const MyInnerStateMachine = withStateMachine(statechart, { channel: 'inner' })(
  MyComponent
)

<MyOuterStateMachine>
  <MyInnerStateMachine>
    <Action channel="outer" is="myOuterAction" />
    <Action channel="inner" is="myInnerAction" />
  </MyInnerStateMachine>
</MyOuterStateMachine>
```

## I'm experiencing the 'Cannot transition in the middle of a transition' error, what should I do?

There's a chance that you are using the wrong approach, but, first of all, let's see why this happens.

When a `react-automata` transition is fired, the library uses `xstate` under the hood to calculate the next state.
When the new state is calculated, `react-automata` stores it in the component's state so that a new update is triggered.
After the state is updated and the tree has been rendered with the new state, all the actions and activity are fired.

Since `react` batches consequent `setState` calls (for performance), if you fire a transition in the middle of a transition, only the last one would actually trigger a render and run the actions.
To prevent this behaviour, the invariant has been added so that when this happens it can be debugged.
For more details, please read [here](https://github.com/MicheleBertoli/react-automata/issues/36).

In most of the cases, you can achieve the same behaviour by using a single transition - similarly to how `flux` actions work.
