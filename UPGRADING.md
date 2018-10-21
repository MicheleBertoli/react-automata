# Upgrading

## From v3.0.0 to v4.0.0

The update to React Automata version 4 introduces some braking changes, which also requires changes in users' code.

First step is to update React Automata dependency, and add `react-test-renderer` separately, since that was changed to a peer dependency
```sh
yarn add react-automata@^4.0.0 react-test-renderer@^16.3
```

### API changes

The exported higher-order component known as `withStatechart` was renamed to `withStateMachine`. You should replace all occurences of `withStatechart` with `withStateMachine` in your code.

`Action` and `State` components props were renamed more consistently. The `hide` and `show` prop from `Action` were unified in the new `is` prop. The `value` prop from `State` was renamed to `is` as well. You should change these props in your code accordingly.

The `testStateChart` method  was renamed to `testStateMachine`, and its signature was changed to `Component[, { fixtures, extendedState }]` from `{ statechart[, fixtures][, extendedState] }, Component`. You need to change that accordingly. Please note that you don't have to pass the statechart to `testStateMachine` directly, the library will automatically extract it from the `withStateMachine` enriched component.
