import idx from 'idx'
import invariant from 'invariant'
import memoize from 'memoize-one'
import PropTypes from 'prop-types'
import React from 'react'
import { Machine, State, StateNode } from 'xstate'
import hoistStatics from 'hoist-non-react-statics'
import Context from './context'
import {
  DEFAULT_CHANNEL,
  getComponentName,
  isStateless,
  stringify,
} from './utils'

const REDUX_DISPATCH = 'DISPATCH'
const REDUX_JUMP_TO_ACTION = 'JUMP_TO_ACTION'
const XSTATE_START_ACTION = 'xstate.start'
const XSTATE_STOP_ACTION = 'xstate.stop'

const withStateMachine = (statechart, options = {}) => Component => {
  class Automata extends React.Component {
    static propTypes = {
      initialData: PropTypes.object,
      initialMachineState: PropTypes.instanceOf(State),
    }

    static machine =
      statechart instanceof StateNode ? statechart : Machine(statechart)

    state = {
      componentState: this.props.initialData,
      machineState:
        this.props.initialMachineState || this.constructor.machine.initialState,
    }

    instance = React.createRef()

    ref = !isStateless(Component) ? this.instance : null

    componentDidMount() {
      if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
          name: getComponentName(Component),
        })
        this.devTools.init(this.state)

        this.unsubscribe = this.devTools.subscribe(message => {
          if (
            message.type === REDUX_DISPATCH &&
            message.payload.type === REDUX_JUMP_TO_ACTION
          ) {
            this.jumpToAction = true
            this.setState(JSON.parse(message.state))
          }
        })
      }

      this.runActions()
    }

    componentDidUpdate(prevProps, prevState) {
      if (!this.jumpToAction) {
        this.handleComponentDidUpdate(prevProps, prevState)
      } else {
        this.jumpToAction = false
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        window.__REDUX_DEVTOOLS_EXTENSION__.disconnect()
      }
    }

    runAction = effect => {
      switch (typeof effect) {
        case 'string':
          if (this.instance.current[effect]) {
            this.instance.current[effect](
              this.state.componentState,
              this.lastEvent
            )
          }
          break
        case 'object':
          if (
            effect.type === XSTATE_START_ACTION ||
            effect.type === XSTATE_STOP_ACTION
          ) {
            if (this.instance.current[effect.activity]) {
              this.instance.current[effect.activity](
                effect.type === XSTATE_START_ACTION
              )
            }
          }
          if (this.instance.current[effect.type]) {
            this.instance.current[effect.type](
              this.state.componentState,
              this.lastEvent
            )
          }
          break
        case 'function':
          effect(this.state.componentState, this.lastEvent)
          break
      }
    }

    runActions() {
      if (idx(this, _ => _.instance.current)) {
        this.state.machineState.actions.forEach(this.runAction)
      }
    }

    handleComponentDidUpdate(prevProps, prevState) {
      this.isTransitioning = false

      if (prevState.machineState !== this.state.machineState) {
        this.runActions()

        if (idx(this, _ => _.instance.current.componentDidTransition)) {
          this.instance.current.componentDidTransition(
            prevState.machineState,
            this.lastEvent
          )
        }

        if (this.devTools) {
          this.devTools.send(this.lastEvent, this.state)
        }
      }
    }

    stringify = memoize(stringify)

    getContext(context) {
      const channel = options.channel || DEFAULT_CHANNEL

      return {
        ...context,
        [channel]: {
          actions: this.state.machineState.actions,
          machineState:
            this.state.machineState.toString() ||
            this.stringify(this.state.machineState.value),
        },
      }
    }

    handleTransition = (event, updater) => {
      invariant(
        !this.isTransitioning,
        'Cannot transition on "%s" in the middle of a transition on "%s".',
        event,
        this.lastEvent
      )

      this.lastEvent = event
      this.isTransitioning = true

      if (idx(this, _ => _.instance.current.componentWillTransition)) {
        this.instance.current.componentWillTransition(event)
      }

      this.setState(prevState => {
        const stateChange =
          typeof updater === 'function'
            ? updater(prevState.componentState)
            : updater
        const machineState = this.constructor.machine.transition(
          prevState.machineState,
          event,
          stateChange
        )

        if (
          machineState.value === prevState.machineState.value &&
          (!stateChange || stateChange === prevState.componentState)
        ) {
          this.isTransitioning = false

          return null
        }

        return {
          componentState: stateChange
            ? { ...prevState.componentState, ...stateChange }
            : prevState.componentState,
          machineState,
        }
      })
    }

    render() {
      return (
        <Context.Consumer>
          {context => (
            <Context.Provider value={this.getContext(context)}>
              <Component
                {...this.props}
                {...this.state.componentState}
                machineState={this.state.machineState}
                ref={this.ref}
                transition={this.handleTransition}
              />
            </Context.Provider>
          )}
        </Context.Consumer>
      )
    }
  }

  hoistStatics(Automata, Component)

  return Automata
}

export default withStateMachine
