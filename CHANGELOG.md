# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.0.2] - 2018-08-16
### Fixed
- Throw a helpful error when `is` is not present in `Action` and `State` [#68](https://github.com/MicheleBertoli/react-automata/pull/68).

## [4.0.1] - 2018-08-12
### Fixed
- Fix an issue for which `componentDidMount` was called unnecessarily under some conditions.

## [4.0.0] - 2018-08-09
### Added
- Add [FAQ](https://github.com/MicheleBertoli/react-automata/blob/master/FAQ.md) section.

### Changed
- Upgrade `xstate` to v3.3.3, and support all the actions types and activities.
- Support conditions in tests [#54](https://github.com/MicheleBertoli/react-automata/pull/54).
- Replace `minimatch` with `glob-to-regexp` [#55](https://github.com/MicheleBertoli/react-automata/pull/55).
- Move `react-test-renderer` to peer dependencies [#56](https://github.com/MicheleBertoli/react-automata/pull/57).
- Unify `Action` and `State` components, and make the (value) `is` props consistent (before: `show`/`hide` VS `value`).
- Rename `withStateChart` to `withStateMachine`, and optimize rendering.
- Rename `testStateChart` to `testStateMachine`, and change its arguments to `Component[, { fixtures, extendedState }]` (before: `{ statechart[, fixtures][, extendedState] }, Component`).
