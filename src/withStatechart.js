import React from 'react'
import PropTypes from 'prop-types'
import { Machine, State, StateNode } from 'xstate'
import idx from 'idx'
import invariant from 'invariant'
import { getComponentName, isStateless, stringify } from './utils'

const withStatechart = (statechart, options = {}) => Component => {
  class StateMachine extends React.Component {
    machine = statechart instanceof StateNode ? statechart : Machine(statechart)

    state = {
      componentState: this.props.initialData,
      machineState: this.props.initialMachineState || this.machine.initialState,
    }

    getChildContext() {
      const channel = options.channel || 'DEFAULT'

      return {
        automata: {
          ...this.context.automata,
          [channel]: {
            actions: this.state.machineState.actions,
            machineState:
              this.state.machineState.toString() ||
              stringify(this.state.machineState.value),
          },
        },
      }
    }

    componentDidMount() {
      if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
          name: getComponentName(Component),
        })
        this.devTools.init(this.state)

        this.unsubscribe = this.devTools.subscribe(message => {
          if (
            message.type === 'DISPATCH' &&
            message.payload.type === 'JUMP_TO_ACTION'
          ) {
            this.jumpToAction = true
            this.setState(JSON.parse(message.state))
          }
        })
      }

      this.runActionMethods()
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        window.__REDUX_DEVTOOLS_EXTENSION__.disconnect()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!this.jumpToAction) {
        this.handleComponentDidUpdate(prevProps, prevState)
      } else {
        this.jumpToAction = false
      }
    }

    runActionMethods() {
      if (this.instance) {
        this.state.machineState.actions.forEach(action => {
          if (this.instance[action]) {
            this.instance[action]()
          }
        })
      }
    }

    handleComponentDidUpdate(prevProps, prevState) {
      if (prevState.machineState.actions !== this.state.machineState.actions) {
        this.runActionMethods()
      }

      if (prevState.machineState !== this.state.machineState) {
        if (idx(this, _ => _.instance.componentDidTransition)) {
          this.instance.componentDidTransition(
            prevState.machineState,
            this.state.event
          )
        }

        if (this.devTools) {
          this.devTools.send(this.state.event, this.state)
        }
      }

      this.isTransitioning = false
    }

    setInstance = element => {
      this.instance = element
    }

    handleRef = !isStateless(Component) ? this.setInstance : null

    handleTransition = (event, updater) => {
      invariant(
        !this.isTransitioning,
        'Cannot transition on "%s" in the middle of a transition on "%s".',
        event,
        this.lastEvent
      )

      this.lastEvent = event
      this.isTransitioning = true

      if (idx(this, _ => _.instance.componentWillTransition)) {
        this.instance.componentWillTransition(event)
      }

      this.setState(prevState => {
        const stateChange =
          typeof updater === 'function'
            ? updater(prevState.componentState)
            : updater
        const nextState = this.machine.transition(
          prevState.machineState,
          event,
          stateChange
        )

        return {
          componentState: { ...prevState.componentState, ...stateChange },
          event,
          machineState: nextState,
        }
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state.componentState}
          machineState={this.state.machineState}
          ref={this.handleRef}
          transition={this.handleTransition}
        />
      )
    }
  }

  StateMachine.propTypes = {
    initialData: PropTypes.object,
    initialMachineState: PropTypes.instanceOf(State),
  }

  StateMachine.contextTypes = {
    automata: PropTypes.object,
  }

  StateMachine.childContextTypes = {
    automata: PropTypes.object,
  }

  StateMachine.isStateMachine = true

  return StateMachine
}

export default withStatechart
